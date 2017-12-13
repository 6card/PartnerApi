import { Component, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Channel } from '../../shared/media';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { UserAgreement } from '../../services/user-agreement.service';

const COUNT_FAIL_UPLOAD = 3;

@Component({
    selector: 'video-upload',
    templateUrl: './video-upload.component.html'
})

export class VideoUploadComponent extends CommonComponent implements OnDestroy {

    @Output() onSendVideoDone: EventEmitter<any> = new EventEmitter();
    @Input() mediaId: number;
    
    @ViewChild('videoFileInput') inputVariable: any;

    public videoFile: File = null;    
    public isSending: boolean = false;
    public videoFileProgress: number = 0;
    public isVideoUploadDone: boolean = false;
    public uploadErrorCounter: number = 0;

    constructor(
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        protected userAgreement: UserAgreement,
    ) { 
        super(authService, partnerService, alertService, userAgreement);
    }

    onSendVideo(event: any): void {
        this.UploadVideoFile(this.videoFile);        
    }

    ChangeListener($event: any): void {
        this.videoFile = $event.target.files[0];
        this.isVideoUploadDone = false;
    }

    ClearVideoFile() {
        this.videoFile = null;
    }

    UploadVideoFile(videoFile: File){        
        this.partnerService.startUpload(this.authService.sessionId, this.mediaId, 0)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            this.isVideoUploadDone = false;
            this.isSending = true;
            this.readThis(videoFile, data.Data);            
        }, 
            error => this.errorHandler(error)
        ); 
    }

    readThis(videoFile: File, uploadSessionId: any){        
        if (!videoFile) {            
            return;
        }
        if (videoFile.size > 1000000) 
            this.UploadPortion(videoFile, uploadSessionId, 0, 1000000);
        else
            this.UploadPortion(videoFile, uploadSessionId, 0, videoFile.size);
    }

    UploadPortion(file: File, uploadSessionId: any, start: number, length: number, last?: boolean) 
    {
        var myReader:FileReader = new FileReader();
        var blob: Blob;
        var that = this;

        var end = start + length;

        if (!this.isSending) {
            return;
        }

        if (end > file.size)
            end = file.size;

        blob = file.slice(start, end);

        myReader.onloadend = function(e){
             if (this.readyState == 2) { // Загрузка DONE

                //загружаем кусок и после удачной загрузки рисуем прогресс и запускаем следующую порцию

                that.partnerService.videoUpload(uploadSessionId, start, blob, file.name)
                .takeWhile(() => that.alive)  
                .subscribe( res => {  
                    let data = that.respondHandler(res);
                    that.videoFileProgress = Math.round((start + blob.size) * 100 / file.size);
                    if (end >= file.size) {
                        that.partnerService.completeUpload(uploadSessionId)
                        .takeWhile(() => that.alive)
                        .subscribe( res => {                             
                            let data = that.respondHandler(res);
                            if (data.Success == true) {
                                 that.VideoUploadDone();
                            }
                            else {
                                if (data.Message.Id == 17) {
                                    if(confirm(data.Message.Text + " Привязать это видео?")) {
                                        that.setVideo(data.Data);
                                    }
                                    else {
                                        that.VideoUploadFail();
                                    }
                                }
                            }
                        }, 
                            error => that.errorHandler(error)
                        ); ;
                    }
                    else {
                        that.UploadPortion(file, uploadSessionId, end, length);
                    }
  
                }, 
                    //Обработка неудачной загрузки
                    error => {                        
                        if (that.uploadErrorCounter < COUNT_FAIL_UPLOAD){
                            that.uploadErrorCounter++;
                            that.UploadPortion(file, uploadSessionId, start, length);
                        }
                        else {
                            if(confirm("Произошла ошибка при загрузке видеофайла. Повторить попытку?")) {
                                that.uploadErrorCounter = 0;
                                that.UploadPortion(file, uploadSessionId, start, length);
                            }
                            else {
                                that.VideoUploadFail();
                                that.errorHandler(error);
                            }
                        }
                        
                    }
                ); 
             }
        } 
        myReader.readAsDataURL(blob);        
    }

    setVideo(videoId: number) {
        this.partnerService.setVideo(this.authService.sessionId, videoId, this.mediaId, 1)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Success == true) {
                this.VideoUploadDone();
            }
        }, 
            error => this.errorHandler(error)
        );
    }

    VideoUploadDone() {
        this.ClearVideoFile();
        this.isVideoUploadDone = true;
        this.isSending = false;
        this.videoFileProgress = 0;
        this.onSendVideoDone.emit();
    }

    VideoUploadFail() {
        this.ClearVideoFile();
        this.isSending = false;
        this.videoFileProgress = 0;
    }

    //прекратить загрузку при смене страницы
    ngOnDestroy() {
        this.alive = false;
        this.VideoUploadFail();
    }

}
