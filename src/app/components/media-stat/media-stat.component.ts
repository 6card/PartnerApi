//компонент для статистики, но уже не нужен
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { UserAgreement } from '../../services/user-agreement.service';

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
        protected userAgreement: UserAgreement,
        
        private	router:	Router,
        private route: ActivatedRoute
    ) { 
        super(authService, partnerService, alertService, userAgreement);
    }

    ngOnInit(){
       this.route.params.forEach((params: Params) => {
            this.mediaId = params['id'];
            this.loadMediaCounters(this.mediaId);
        });

    }    

    loadMediaCounters(mediaId: number) { 
        this.partnerService.getMediaStat(this.authService.sessionId, mediaId, '2017-08-10', '2017-08-17')
        .takeWhile(() => this.alive)
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data !== undefined) {
                data.Data.map((item:any) =>  this.counters.push(new Counter(item)));  
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

}