import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { PartnerService } from '../services/partner.service';

export class CommonComponent implements OnInit, AfterViewInit {

    constructor(        
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService
    ) { }

    /*
        ALTERNATIVE 

        injector = ReflectiveInjector.resolveAndCreate([AlertService]);
        private alertService = this.injector.get(AlertService);
    */

    ngOnInit(){ }    
    ngAfterViewInit() { }

    ngOnDestroy() { }

    protected respondHandler(data: any) {
        if (!data.Success) {
            this.alertService.error(data.Message.Id, data.Message.Text);
        }        
        return data;        
    }

    protected errorHandler(error: any) {
        this.alertService.error(0, error);
    }
}