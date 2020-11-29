import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
//"start": "ng serve --proxy-config proxy-conf.json", --Copy this statement in package.json file and run command npm start
/*
register method
            public register(user: TokenPayload): Observable<any> {
            return this.http.post(`/users/register`, user)
            }
          
login method
             public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(`/users/login`, user)

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )

profile method
           public profile(): Observable<any> {
           return this.http.get(`/users/profile`, {
           headers: { Authorization: ` ${this.getToken()}` }
          })
  */

  var registerUrl = "http://localhost:3000/users/register";
  var loginUrl = "http://localhost:3000/users/login";
  var profileUrl = "http://localhost:3000/users/profile";
export interface UserDetails {
  id: number
  name: string
  email: string
  password: string
  phone: string
  birthDate: string 
  exp: number
  iat: number
}

interface TokenResponse {
  token: string
}

export interface TokenPayload {
  id: number
  name: string
  email: string
  phone: string
  password: string
  birthDate: string
}

@Injectable()
export class AuthenticationService {
  private token: string

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('usertoken', token)
    this.token = token
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

  public register(user: TokenPayload): Observable<any> {
   return this.http.post(registerUrl, user)
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

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('usertoken')
    this.router.navigateByUrl('/')
  }
}