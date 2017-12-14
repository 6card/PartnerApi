import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { PartnerService } from '../services/partner.service';
import { UserAgreement } from '../services/user-agreement.service';

export class CommonComponent implements OnInit, AfterViewInit {

    protected alive: boolean = true;

    constructor(        
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        protected userAgreement: UserAgreement
    ) { }


    ngOnInit(){ }    
    ngAfterViewInit() { }

    ngOnDestroy() { 
        this.alive = false;
    }

    loadAgreements() {
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data.length > 0)
                this.userAgreement.add( data.Data[0] )
        }, 
            error => this.errorHandler(error)
        );
    }

    protected respondHandler(data: any) {
        if (!data.Success) {
            if (data.Message.Id && data.Message.Id == 21){
                this.loadAgreements();
            }                       
            this.alertService.error(data.Message.Id, data.Message.Text);            
        }        
        return data;        
    }

    protected errorHandler(error: any) {
        this.alertService.error(0, error);
    }
}