import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

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
        this.partnerService.getMedia(1234, 1).subscribe( data => {  
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