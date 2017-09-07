import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  loading = false;
  error = '';
  returnUrl: string;

  isSended: boolean = false;
  
  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService
  ) {}

  public loginForm = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  ngOnInit() {
      //сброс авторизации
      this.authService.logout();

      //получаем returnUrl
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  doLogin(event:any) {
    this.isSended = true;
    this.error = '';
    if(this.loginForm.dirty && this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.controls['UserName'].value, this.loginForm.controls['Password'].value)
        .subscribe(result => {
            if (result === true) {
                // login successful
                this.router.navigate([this.returnUrl]);
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