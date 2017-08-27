import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Channel } from '../../shared/media';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';

const COUNT_FAIL_UPLOAD = 3;

@Component({
    selector: 'video-upload',
    templateUrl: './video-upload.component.html'
})

export class VideoUploadComponent extends CommonComponent  {

    //@Output() sendVideo: EventEmitter<any> = new EventEmitter();
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
    ) { 
        super(authService, partnerService, alertService);
      /*
      if (!partnerService.xSessionId) {
        this.router.navigate(['login']);
      }
      */
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
        this.partnerService.startUpload(this.authService.sessionId, this.mediaId, 0).subscribe( res => {  
            this.readThis(videoFile, res.Data);
            this.isVideoUploadDone = false;
            this.isSending = true;
        }, 
            error => console.log(error)
        ); 
        
        // сначала сохраняем форму и получаем guid        
        
        //console.log(videoFile);
        /*

        Data	786884
        Success	false
        Message	Object
            Id	17
            Text	"Видео уже принадлежит другому ролику(ам)"
            Data	Object
                MediaIds	[1]
                0	1066142
                SourceId	786884

        this.partnerService.stopUpload(this.authService.sessionId).subscribe( res => {  
            console.log(res);
        }, 
            error => console.log(error)
        );
        */
    }

    readThis(videoFile: File, uploadSessionId: any){        
        if (!videoFile) {            
            return;
        }
        //this.isSending = true;
        if (videoFile.size > 1000000) 
            this.UploadPortion(videoFile, uploadSessionId, 0, 1000000);
        else
            this.UploadPortion(videoFile, uploadSessionId, 0, videoFile.size);
   
        // Загрузка по частям http://www.codenet.ru/webmast/js/html5-ajax-partial-upload/
        /*
            FileReader.readyState
            
            EMPTY   : 0 : Данные еще не были загружены.
            LOADING : 1 : Данные в данный момент загружаются.
            DONE    : 2 : Операция чтения была завершена.
        */
    }

    UploadPortion = (file: File, uploadSessionId: any, start: number, length: number, last?: boolean) => {
        var myReader:FileReader = new FileReader();
        var blob: Blob;
        var that = this;

        var end = start + length;
        if (end > file.size)
            end = file.size;

        blob = file.slice(start, end);

        myReader.onloadend = function(e){
             if (this.readyState == 2) { // Загрузка DONE

                //console.log('uploading ' + start + '-' + end + '/' + file.size)

                //загружаем кусок и после удачной загрузки рисуем прогресс и запускаем следующую порцию

                that.partnerService.videoUpload(uploadSessionId, start, blob, file.name).subscribe( res => {  
                    //console.log();
                    that.videoFileProgress = Math.round((start + blob.size) * 100 / file.size);
                    //console.log('loaded');
                    if (end >= file.size) {
                        //console.log('end');
                        that.partnerService.completeUpload(uploadSessionId).subscribe( res => {                             
                            if (res.Success == true) {
                                 //console.log(res);
                                 that.VideoUploadDone();
                            }
                            else {
                                if (res.Message.Id == 17) {
                                    if(confirm(res.Message.Text + " Привязать это видео?")) {
                                        that.setVideo(res.Data);
                                    }
                                    else {
                                        that.VideoUploadFail();
                                    }
                                }
                            }
                        }, 
                            error => console.log(error)
                        ); ;
                    }
                    else {
                        //console.log('continue...');
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

                //console.log('PERCENT = ' + that.videoFileProgress);

                
             }
        }
 
        myReader.readAsDataURL(blob);
        
    }

    setVideo(videoId: number) {
        this.partnerService.setVideo(this.authService.sessionId, videoId, this.mediaId, 1).subscribe( res => {  
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

}
