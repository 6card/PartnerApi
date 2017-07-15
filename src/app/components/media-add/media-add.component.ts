import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-add',
  templateUrl: './media-add.component.html'
})

export class MediaAddComponent implements OnInit {
    public media: Media;
    public channels: Array<Channel> = [];
    public dateNow = new Date();
    constructor(
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
        console.log('loadChannels');    
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

    addMedia() { 
        this.partnerService.addMedia(this.authService.sessionId, this.media).subscribe( data => {  
            console.log(data);
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }

    formUpdated(params: any) {
        let obj = {
            'ShootDate': this.dateNow,
            'Title' : params.title,
            'Description' : params.description,
            'ChannelId' : params.channelId
        }
        this.media = new Media(obj);
        this.addMedia();
    }
}