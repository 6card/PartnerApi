import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-add',
  templateUrl: './media-add.component.html'
})

export class MediaAddComponent extends CommonComponent {
    public media: Media;
    public channels: Array<Channel> = [];
    constructor(
        private router: Router,
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService
    ) { 
        super(authService, partnerService, alertService);
    }

    ngOnInit(){   
        this.loadChannels();        
    }

    loadChannels() { 
        this.partnerService.getChannels(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.channels.push(new Channel(item)));  
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    addMedia() { 
        this.partnerService.addMedia(this.authService.sessionId, this.media)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            this.router.navigate(['/media', data.Data]);
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
        this.addMedia();
    }

}