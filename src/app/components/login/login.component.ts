import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';
  private alive: boolean = true;

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

  ngOnDestroy() { 
    this.alive = false;
  }

}