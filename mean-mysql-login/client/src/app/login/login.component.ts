import { Component } from '@angular/core'
import { AuthenticationService, TokenPayload } from '../authentication.service'
import { Router } from '@angular/router'

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    id: 0,
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: ''
  }

  constructor(private auth: AuthenticationService, private router: Router) {}
  showErrorMessage = false;
  login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        this.showErrorMessage = true;        
      }
    )
  }
}