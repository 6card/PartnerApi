import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { UserAgreement } from '../../services/user-agreement.service';
import { PartnerService } from '../../services/partner.service';

import { CommonComponent }  from '../../shared/common.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent extends CommonComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';
  isSended: boolean = false;
  
  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    protected authService: AuthService,
    protected partnerService: PartnerService,
    protected alertService: AlertService,
    protected userAgreement: UserAgreement
  ) {
    super(authService, partnerService, alertService, userAgreement);
  }

  public loginForm = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  ngOnInit() {
      //сброс авторизации
      this.authService.logout();
  }

  doLogin(event:any) {
    let returnUrl: string;

    this.isSended = true;
    this.error = '';
    
    if(this.loginForm.dirty && this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.controls['UserName'].value, this.loginForm.controls['Password'].value)
        .takeWhile(() => this.alive)  
        .subscribe(result => {
            if (result === true) {
                // login successful
                this.loadAgreements();
                returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; //получаем returnUrl
                this.router.navigate([returnUrl]);
            } else {
                // login failed
                this.error = 'Неправильный логин или пароль';
                this.loading = false;
            }
        });
    }
  }

  public getError() {
    if (this.error)
      return 'block'
    else
      return 'none';
  }


}