import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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
  getUser() {
    return this.user.asObservable();
  }

  setLoginStatus() {
    this.http
      .get<boolean>(`${environment.api_url}/isloggedin`)
      .subscribe((res) => {
        console.log(res);
        this.loginStatus.next(res);
      });
  }

  checkIsLoggedIn() {
    return this.loginStatus.value;
  }
  getToken() {
    return localStorage.getItem('token');
  }
}
