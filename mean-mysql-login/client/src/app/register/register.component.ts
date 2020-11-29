import { Component } from "@angular/core";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  credentials: TokenPayload = {
    id: 0,
    name: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
  };
 
  ageError = false;
  age: number;
 
  constructor(private auth: AuthenticationService, private router: Router) { }
   checkDate(){
    if(this.credentials.birthDate){
      let today = new Date();
      let currentYear = today.getFullYear();
      let selectedDate =new Date(this.credentials.birthDate);
      let selectedYear = selectedDate.getFullYear();
      let ageDiff =  currentYear - selectedYear
      if(ageDiff < 21){
       // console.log(ageDiff)
        this.ageError = true
      }else{
        this.ageError = false;
      }
    }
  
   }


  showErrorMessage = false;
  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/login");
      },
      (err) => {
        this.showErrorMessage = true;
      }
    );
  }
}