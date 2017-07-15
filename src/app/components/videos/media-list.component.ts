import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';
@Component({
  selector: 'media-list',
  templateUrl: './media-list.component.html'
})

export class MediaListComponent implements OnInit, OnDestroy, AfterViewInit {
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
        console.log('media-list ngOnInit');
      this.medias.length = 0;

      this.partnerService.getMedias(this.authService.sessionId).subscribe( data => {  
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.medias.push(new Media(item)));  
                //console.log(this.medias); 
            }        
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        });    
            
    }

    ngOnDestroy(){
        console.log('media-list ngOnDestroy');
    }

    ngAfterViewInit() { 
        console.log('media-list ngAfterViewInit');
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        
    }

}