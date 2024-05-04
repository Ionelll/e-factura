import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private user = new BehaviorSubject<User | undefined>(undefined);
  private loginStatus = new BehaviorSubject<boolean>(false);

  login(userInput: { email: string | null; password: string | null }) {
    if (userInput.email && userInput.password)
      this.http
        .post<{ loggedin: boolean; user: User; token: string }>(
          `${environment.api_url}/login`,
          userInput
        )
        .subscribe((res) => {
          if (res && res.user) {
            this.user.next(res.user);
            localStorage.setItem('token', res.token);
            this.loginStatus.next(res.loggedin);
            this.router.navigateByUrl('/dashboard');
          }
        });
  }
register(userInput: { email: string | null; password: string | null;confirmPassword: string | null }) {
    if (userInput.email && userInput.password === userInput.confirmPassword){   
     const {confirmPassword,...registerData}=userInput
       this.http
        .post<{ message: string }>(`${environment.api_url}/register`, registerData)
        .subscribe((res) => {
          if (res) {
            this.router.navigateByUrl('/login');
          }
        })
    }
  }
  getUser() {
    return this.user.asObservable();
  }

  getLoginStatus() {
    return this.loginStatus.asObservable();
  }

  setLoginStatus() {
    this.http
      .get<{ message: string }>(`${environment.api_url}/isloggedin`)
      .subscribe((res) => {
        console.log(res);
        if (res.message === 'Token passed') this.loginStatus.next(true);
        else {
          this.logout();
          this.loginStatus.next(false);
        }
      });
  }

  getToken() {
    return localStorage.getItem('token');
  }
  logout() {
    this.http.post(`${environment.api_url}/logout`, undefined);
    localStorage.clear();
  }
}
