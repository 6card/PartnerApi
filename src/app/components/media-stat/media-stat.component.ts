import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';

import { Counter } from '../../shared/media';
@Component({
  selector: 'media-stat',
  templateUrl: './media-stat.component.html'
})

export class MediaStatComponent extends CommonComponent {

    public mediaId: number;
    public counters: Array<Counter> = [];

    constructor(
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        
        private	router:	Router,
        private route: ActivatedRoute
    ) { 
        super(authService, partnerService, alertService);
      /*
      if (!partnerService.xSessionId) {
        this.router.navigate(['login']);
      }
      */
    }

    ngOnInit(){
       this.route.params.forEach((params: Params) => {
            this.mediaId = params['id'];
            this.loadMediaCounters(this.mediaId);
        });

    }    

    loadMediaCounters(mediaId: number) { 
        this.partnerService.getMedia(this.authService.sessionId, mediaId, 1).subscribe( res => {  
            let data = this.respondHandler(res);
            if (data !== undefined) {
                data.Data.map((item:any) =>  this.counters.push(new Counter(item)));  
                //console.log(data);
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

}