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
    UserName: ['vk_31', Validators.required],
    Password: ['CRaq5qaza8pa', Validators.required]
  });

  doLogin(event:any) {
    console.log(this.loginForm.value);
    this.partnerService.getSessionId(this.loginForm.value)
    .subscribe( data => {
        this.partnerService.xSessionId = data.Data.SessionId;
        console.log(data.Data.SessionId);
    }, (err) => {
        console.log('Error');
    }, () => { // <----
        console.log('Session get');
    });
  }

}