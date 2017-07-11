import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {

  constructor(
    public fb: FormBuilder,
    private partnerService:PartnerService
  ) {}

  public loginForm = this.fb.group({
    UserName: [null, Validators.required],
    Password: [null, Validators.required]
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