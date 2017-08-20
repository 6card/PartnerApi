import { Component, OnInit } from '@angular/core';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';

import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent extends CommonComponent implements OnInit{

  reportsUrl: any;
  isLoggedIn : boolean = false;

  constructor(
    protected authService:AuthService,
    protected partnerService: PartnerService,
    protected alertService: AlertService
  ){
    super(authService, partnerService, alertService);
    
  }

  ngOnInit(){
      //this.isLoggedIn = this.authService.isLoggedIn();
      this.authService.isLoggedIn().subscribe( res => {  
        //let data = this.respondHandler(res);
        this.isLoggedIn = res;
        //console.log(this.isLoggedIn);
        if(this.isLoggedIn) {
          this.partnerService.getReportsUrl(this.authService.sessionId).subscribe( res => {  
              let data = this.respondHandler(res);
              this.reportsUrl = data.Data;
          }, 
              error => this.errorHandler(error)
          );
        }
        else {
          this.reportsUrl = false;
        }
    }, 
        error => this.errorHandler(error)
    );

      

  }

  //(isLoggedIn | async) or authService.isAuthenticated()
}