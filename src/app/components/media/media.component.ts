import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html'
})

export class MediaComponent implements OnInit, AfterViewInit {
    public media: Media;
    constructor(
        private	router:	Router,
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
            
    }

    ngAfterViewInit() { 
        this.partnerService.getMedia(this.authService.sessionId, 1234, 1).subscribe( data => {  
            if (data !== undefined) {
                this.media = new Media(data);   
                console.log(this.media);
            }   
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }
}