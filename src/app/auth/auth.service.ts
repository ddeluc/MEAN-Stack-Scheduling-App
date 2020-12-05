import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  // Any component that is concerned with whether or not a user
  // is authenticated will call this function and subscribe to the
  // authStatusListener. Anytime next() is called on this observable,
  // the subscribers will be notified.
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // Logout after an hour
          setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000)
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          // Navigate to the homepage
          this.router.navigate(['/']);
        }
      })
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    // Clear timeout timer once logged out
    clearTimeout(this.tokenTimer);
  }
}
