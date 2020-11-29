import { Component } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";
import { TokenPayload } from '../interfaces/token-payload';

@Component({
  templateUrl: "./register.component.html",
  styleUrls:  ["./register.component.css"]
})

export class RegisterComponent {
  credentials: TokenPayload = {
    id : 0,
    name : "",
    email : "",
    phone : "",
    password : "",
    birthDate : ""
  }
 
  connectionError = false;
  registerError = false;
  ageError = false;
  captchaError = true;
  dataloading = false;
  age: number;
  
  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute  ) { }
  
  checkDate(){
    if(this.credentials.birthDate){
      let today = new Date();
      let currentYear = today.getFullYear();
      let selectedDate =new Date(this.credentials.birthDate);
      let selectedYear = selectedDate.getFullYear();
      let ageDiff =  currentYear - selectedYear
      if(ageDiff < 21){
        this.ageError = true
      }else{
        this.ageError = false;
      }
    }
  }
  
  lettersOnly(input){
    var k = input.charCode;
    if(k > 31 && k !=  32 && (k < 65 || k > 90) && (k < 97 || k > 122))
        return false;
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaError = false;
}
  register() {
    this.dataloading = true;
    this.auth.register(this.credentials)
    .subscribe(
      () => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } })
      },
      error => {
        this.dataloading = false;
        if(error == 'connection')
        this.connectionError = true;
        else if(error == 'database')
        this.registerError = true;
        else if(error == 'client')
        alert(error)
      }
    );
  } //register close
}