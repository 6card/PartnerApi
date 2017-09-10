import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { PartnerService } from '../services/partner.service';

export class CommonComponent implements OnInit, AfterViewInit {

    protected alive: boolean = true;

    constructor(        
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService
    ) { }


    ngOnInit(){ }    
    ngAfterViewInit() { }

    ngOnDestroy() { 
        this.alive = false;
    }

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