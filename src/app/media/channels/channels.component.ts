import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { PartnerService } from '../../shared/partner.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})

export class ChannelsComponent {
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
}