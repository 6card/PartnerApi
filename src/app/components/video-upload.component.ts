import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Channel } from '../shared/media';

import { CommonComponent }  from '../shared/common.component';

import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { PartnerService } from '../services/partner.service';

@Component({
    selector: 'video-upload',
    template: `
        <div class="ui form">
            <div class="field video">
                <div class="ui action input" *ngIf="this.videoFile">
                    <input type="text" [value]="this.videoFile ? this.videoFile.name : ''" [disabled]="true">
                    <button type="button" (click)="onSendVideo($event)" class="ui red button">Send</button>
                    <button type="button" (click)="ClearVideoFile()" class="ui button">Cancel</button>
                </div>
                <label class="fluid ui big green button" *ngIf="!this.videoFile" for="videoFile"> 
                    Upload Video &nbsp;
                    <i class="upload icon"></i>
                    <input #videoFileInput type="file" id="videoFile" name="videoFile" (change)="ChangeListener($event)" style="display: none">
                </label>

                <div *ngIf="videoFileProgress > 0" class="ui indicating progress" [attr.data-percent]="videoFileProgress">
                    <div class="bar" [ngStyle]="{'transition-duration': '300ms', 'width': videoFileProgress+'%'}">
                        <div class="progress">{{videoFileProgress}}%</div>
                    </div>
                    <div class="label">Uploading Video...</div>
                </div>
            </div>
        </div>
        `
})

export class VideoUploadComponent extends CommonComponent  {

    @Output() sendVideo: EventEmitter<any> = new EventEmitter();
    @Input() mediaId: number;
    @Input() videoFileProgress: number;
    @ViewChild('videoFileInput') inputVariable: any;

    public videoFile: File = null;    
    public isSending: boolean = false;

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
    }

    ClearVideoFile() {
        this.videoFile = null;
    }

    UploadVideoFile(videoFile: File){        
        this.partnerService.startUpload(this.authService.sessionId, this.mediaId, 0).subscribe( res => {  
            this.readThis(videoFile, res.Data);
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

                console.log('uploading ' + start + '-' + end + '/' + file.size)

                //загружаем кусок и после удачной загрузки рисуем прогресс и запускаем следующую порцию

                that.partnerService.videoUpload(uploadSessionId, start, blob, file.name).subscribe( res => {  
                    //console.log();
                    that.videoFileProgress = Math.round((start + blob.size) * 100 / file.size);
                    console.log('loaded');
                    if (end >= file.size) {
                        console.log('end');
                        that.partnerService.completeUpload(uploadSessionId).subscribe( res => {                             
                            if (res.Success == true) {
                                 console.log(res);
                            }
                            else {
                                if (res.Message.Id == 17) {
                                    if(confirm(res.Message.Text + " Привязать это видео?")) {
                                        that.setVideo(res.Data);
                                    }
                                }
                            }
                        }, 
                            error => console.log(error)
                        ); ;
                    }
                    else {
                        console.log('continue...');
                        that.UploadPortion(file, uploadSessionId, end, length);
                    }
  
                }, 
                    error => console.log(error)
                ); 

                //console.log('PERCENT = ' + that.videoFileProgress);

                
             }
        }
 
        myReader.readAsDataURL(blob);
        
    }

    setVideo(videoId: number) {
        this.partnerService.setVideo(this.authService.sessionId, videoId, this.mediaId, 1).subscribe( res => {  
            let data = this.respondHandler(res);
        }, 
            error => this.errorHandler(error)
        );
    }

}
