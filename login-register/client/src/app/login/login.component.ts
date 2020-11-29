import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthenticationService } from '../services/authentication.service'
import { TokenPayload } from '../interfaces/token-payload'
@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    id : 0,
    name : "",
    email : "",
    phone : "",
    password : "",
    birthDate : ""
  }
  infoMessage = false;
  showErrorMessage = false;
  captchaError = true;
  dataloading = false;

  constructor(private auth: AuthenticationService, private router: Router, private route:ActivatedRoute) {}
  
  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      if(params.registered !== undefined && params.registered === 'true') {
        this.infoMessage = true;
      }
    });
    if(this.auth.isLoggedIn())
    this.router.navigateByUrl('/profile');
  } //ng onint close
  
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaError = false;
}

  login() {
    this.dataloading = true
    this.auth.login(this.credentials)
    .subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        this.dataloading = false;
        this.showErrorMessage = true;        
      }
    )
  } //login close
}