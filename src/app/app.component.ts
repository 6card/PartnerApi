import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { Router } from "@angular/router";
import { PartnerService } from './services/partner.service';

import {Observable} from 'rxjs/Rx';

import 'jquery';
import 'semantic-ui/dist/semantic.min.js'
import '../assets/css/styles.css';
import '../assets/css/semantic.min.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit  {

    constructor(
        private	router:	Router,
        private partnerService:PartnerService
    ) { }
 
    ngOnInit(){

    }
    ngAfterViewInit() { 
        console.log(jQuery.fn.jquery);
    }

    goLogin()	{
        this.router.navigate(['login']);
    }
    
}