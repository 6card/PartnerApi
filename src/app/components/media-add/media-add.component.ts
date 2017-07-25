import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-add',
  templateUrl: './media-add.component.html'
})

export class MediaAddComponent implements OnInit {
    public media: Media;
    public channels: Array<Channel> = [];
    constructor(
        private authService:AuthService,
        private partnerService:PartnerService,
        private alertService: AlertService
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

    addMedia() { 
        this.partnerService.addMedia(this.authService.sessionId, this.media).subscribe( data => {  
            console.log(data);
        }, 
        error => this.errorHandler(error)
        ); 
    }

    formUpdated(params: any) {
        
        let obj = {
            'ShootDate': params.shootDate,
            'Title' : params.title,
            'Description' : params.description,
            'ChannelId' : params.channelId
        }
        
        this.media = new Media(obj);
 
        console.log(this.media);
        //this.addMedia();
    }

    private respondHandler(data: any) {
        if (!data.Success) {
            this.alertService.error(data.Message.Text);
            return false;
        }        
        return data;        
    }

    private errorHandler(error: any) {
        this.alertService.error(error);
    }
}