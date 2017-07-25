import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';

import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-navigation',
  template: `
        <div class="ui inverted menu">
          <div class="ui container">    
            <a class="item header" [routerLinkActive]="['active']" [routerLink]="['/media']">Medias</a>
            <a class="green color item" [routerLinkActive]="['active']" [routerLink]="['/media/add']"><i class="plus icon"></i>Add media</a>
            <div class="right menu">
              <a *ngIf="!authService.isAuthenticated()" class="item" [routerLinkActive]="['active']" [routerLink]="['/login']">Login</a>  
              <a *ngIf="authService.isAuthenticated()" class="item" [routerLinkActive]="['active']" [routerLink]="['/login']">{{ authService.username }} Logout</a>  
            </div>
          </div>
        </div>
`
})
export class NavigationComponent {


  isLoggedIn : Observable<boolean>;

  constructor(private authService:AuthService){
    this.isLoggedIn = authService.isLoggedIn();
  }

  //(isLoggedIn | async) or authService.isAuthenticated()
}