import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PartnerService } from '../shared/partner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(
    public fb: FormBuilder,
    private partnerService:PartnerService
  ) {}

  public loginForm = this.fb.group({
    UserName: ["string", Validators.required],
    Password: ["string", Validators.required]
  });

  doLogin(event:any) {
    console.log(this.loginForm.value);
    this.partnerService.getSessionId(this.loginForm.value)
    .subscribe( data => {
        this.partnerService.xSessionId = data.SessionId;
        //console.log(this.remote);
    }, (err) => {
        console.log('Error');
    }, () => { // <----
        console.log('Session get');
    });
  }

}