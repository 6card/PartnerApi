import { Component, OnInit, AfterViewChecked  } from '@angular/core';
import { Router } from "@angular/router";
import { PartnerService } from './shared/partner.service';


import {Observable} from 'rxjs/Rx';

import '../assets/css/styles.css';
import '../assets/css/semantic.min.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked  {

    constructor(
        private	router:	Router,
        private partnerService:PartnerService
    ) { }
 
    ngOnInit(){

    }
    ngAfterViewChecked() { 
        
    }

    goLogin()	{
        this.router.navigate(['login']);
    }
    
}