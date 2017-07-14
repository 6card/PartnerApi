import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html'
})

export class VideoComponent implements OnInit, AfterViewInit {
    public medias: Array<Media> = [];
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
      this.medias.length = 0;

      this.partnerService.getMedias(this.authService.sessionId).subscribe( data => {  
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.medias.push(new Media(item)));  
                console.log(this.medias); 
            }        
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        });    
            
    }

    ngAfterViewInit() { 
        /*
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        */
    }

}