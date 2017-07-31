import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AlertService } from '../services/alert.service';

export class CommonComponent implements OnInit, AfterViewInit {

    constructor(
        private alertService: AlertService
    ) { }

    ngOnInit(){ }
    ngAfterViewInit() { }

    protected respondHandler(data: any) {
        if (!data.Success) {
            this.alertService.error(data.Message.Text);
        }        
        return data;        
    }

    protected errorHandler(error: any) {
        this.alertService.error(error);
    }
}