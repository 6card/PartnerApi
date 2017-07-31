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

    constructor(
        private authService: AuthService,
        private partnerService: PartnerService,
        private	router:	Router,
        private route: ActivatedRoute,

        alertService: AlertService,
    ) { 
        super(alertService);
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
        this.media.ShootDate = params.shootDate;
        this.media.State = params.state ? 1 : 0;

        console.log(this.media);
        //this.updateMedia();
    }

}