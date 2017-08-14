import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {


  isLoggedIn : Observable<boolean>;

  constructor(private authService:AuthService){
    this.isLoggedIn = authService.isLoggedIn();
  }

  //(isLoggedIn | async) or authService.isAuthenticated()
}