import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { map, retry, catchError } from 'rxjs/operators'
import { Router } from '@angular/router'
import { UserDetails } from '../interfaces/user-details';
import { TokenPayload } from '../interfaces/token-payload';
import { TokenResponse } from '../interfaces/token-response'
//URL
var registerUrl = "http://localhost:3000/users/register";
var loginUrl = "http://localhost:3000/users/login";
var profileUrl = "http://localhost:3000/users/profile";


@Injectable()
export class AuthenticationService {
  private token: string
  
  
  constructor(private http: HttpClient, private router: Router) {}

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(registerUrl, user)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
   }
   
   handleError(error){
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // client-side error
     errorMessage = 'client';
    }else {
      // server-side error
      if(error.status == 0)
      errorMessage = 'connection';      
      if(error.status == 404)
      errorMessage = 'database';
    } 
    return throwError(errorMessage);
  }

   private saveToken(token: string): void {
    localStorage.setItem('usertoken', token)
    this.token = token
  }

   public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(loginUrl, user)

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )
    return request
  }

  public profile(): Observable<any> {
    return this.http.get(profileUrl, {
      headers: { Authorization: ` ${this.getToken()}` }
    })
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('usertoken')
    }
    return this.token
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken()
    let payload
    if (token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails()
    if (user) {
      return user.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('usertoken')
    this.router.navigateByUrl('/')
  }
}



