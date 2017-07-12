import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html'
})

export class ChannelsComponent implements OnInit, AfterViewInit {
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

      this.partnerService.getMedia(1, 1).subscribe( data => {  
            this.media = new Media(data);   
            console.log(this.media);         
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        });    
            
    }

    ngAfterViewInit() { 
        
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        
    }
}