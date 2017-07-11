import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html'
})

export class ChannelsComponent implements OnInit, AfterViewInit {
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
        /*
      this.partnerService.getChannels().subscribe( data => {  
            console.log(data.Success);            
        }, (err) => {
            console.error('Get Channels ERROR');
        }, () => {
            //console.log('Torrents get');
        });    
        */      
    }

    ngAfterViewInit() { 
        
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        
    }
}