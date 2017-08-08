import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';

import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-detail',
  templateUrl: './media-detail.component.html'
})

export class MediaDetailComponent extends CommonComponent {
    public media: Media;
    public mediaId: number;
    public channels: Array<Channel> = [];
    videoFileProgress: number = 0;

    constructor(
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        
        private	router:	Router,
        private route: ActivatedRoute
    ) { 
        super(authService, partnerService, alertService);
      /*
      if (!partnerService.xSessionId) {
        this.router.navigate(['login']);
      }
      */
    }

    ngOnInit(){
       this.route.params.forEach((params: Params) => {
            this.mediaId = params['id'];
            this.loadMedia(this.mediaId);
        });
        
        this.loadChannels();
    }

    loadChannels() { 
        this.partnerService.getChannels(this.authService.sessionId).subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.channels.push(new Channel(item)));  
                console.log(this.channels); 
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    loadMedia(mediaId: number) { 
        this.partnerService.getMedia(this.authService.sessionId, mediaId, 1).subscribe( res => {  
            let data = this.respondHandler(res);
            if (data !== undefined) {
                this.media = new Media(data.Data); 
                //console.log(data);
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    updateMedia() { 
        this.partnerService.updateMedia(this.authService.sessionId, this.media).subscribe( res => {  
            let data = this.respondHandler(res);
        }, 
            error => this.errorHandler(error)
        ); 
    }

    changeMediaBlock(e: any) {
        let blockFunction;

        if(e.target.checked){
            blockFunction = this.partnerService.blockMedia(this.authService.sessionId, this.mediaId, 1);
        }
        else {
            blockFunction = this.partnerService.unblockMedia(this.authService.sessionId, this.mediaId, 1);
        }

        blockFunction.subscribe( res => {  
            let data = this.respondHandler(res);
        }, 
            error => this.errorHandler(error)
        );
    }

    formUpdated(params: any) {

        this.media.Title = params.title;
        this.media.Description = params.description;
        this.media.ChannelId = params.channelId;
        this.media.ShootDateUtc = params.shootDate;
        
        this.media.State = params.state ? 1 : 0;

        //console.log(this.media);
        this.updateMedia();
    }

    UploadVideoFile(videoFile: File){
        
        this.partnerService.startUpload(this.authService.sessionId, this.mediaId, 0).subscribe( res => {  
            //console.log();
            this.readThis(videoFile, res.Data);

        }, 
            error => console.log(error)
        ); 
        
        // сначала сохраняем форму и получаем guid        
        
        //console.log(videoFile);
        /*
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
                            console.log(res);
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

}