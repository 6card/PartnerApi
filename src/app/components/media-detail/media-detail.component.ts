import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-detail',
  templateUrl: './media-detail.component.html'
})

export class MediaDetailComponent implements OnInit {
    public media: Media;
    public mediaId: number;
    public channels: Array<Channel> = [];
    constructor(
        private	router:	Router,
        private route: ActivatedRoute, 
        private authService:AuthService,
        private partnerService:PartnerService
    ) { 
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
        this.partnerService.getChannels(this.authService.sessionId).subscribe( data => {  
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.channels.push(new Channel(item)));  
                console.log(this.channels); 
            }   
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }

    loadMedia(mediaId: number) { 
        this.partnerService.getMedia(this.authService.sessionId, mediaId, 1).subscribe( data => {  
            if (data !== undefined) {
                this.media = new Media(data); 
                console.log(data);
            }   
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }

    updateMedia() { 
        this.partnerService.updateMedia(this.authService.sessionId, this.media).subscribe( data => {  
            console.log(data);
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }

    formUpdated(params: any) {
        this.media.Title = params.title;
        this.media.Description = params.description;
        this.media.ChannelId = params.channelId;
        this.media.ShootDate = params.shootDate;
        //console.log(params);
        //console.log(this.media);
        //this.updateMedia();
    }
}