import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from './services/auth.service';

import {Observable} from 'rxjs/Rx';

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
        private authService:AuthService
    ) {

    }
 
    ngOnInit(){

    }
    ngAfterViewInit() { 
        console.log(jQuery.fn.jquery);
    }

    goLogin() {
        this.router.navigate(['login']);
    }

    doLogout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
    
}