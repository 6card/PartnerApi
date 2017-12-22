import { Component, OnInit } from '@angular/core';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { UserAgreement } from '../../services/user-agreement.service';

import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent extends CommonComponent implements OnInit{
  //reportsUrl: any;
  //isLoggedIn : boolean = false;

  constructor(
    public authService:AuthService,
    protected partnerService: PartnerService,
    protected alertService: AlertService,
    protected userAgreement: UserAgreement,
  ){
    super(authService, partnerService, alertService, userAgreement);
    
  }

  ngOnInit(){
    /*
      this.authService.isLoggedIn()
      .takeWhile(() => this.alive)  
      .subscribe( res => {  
        this.isLoggedIn = res;
        if(this.isLoggedIn) {
          this.partnerService.getReportsUrl(this.authService.sessionId)
          .takeWhile(() => this.alive)  
          .subscribe( res => {  
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
    */
  }
}