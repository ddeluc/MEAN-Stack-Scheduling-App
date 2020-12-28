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
  private authStatusListener = new Subject<{isAuth: boolean, username: string}>();
  private tokenTimer: any;
  private username: string | undefined;

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

  createUser(name: string, email: string, password: string, activated: boolean, admin: boolean) {
    console.log("Trying to create user ...");
    const user = {
      name: name,
      email: email,
      password: password,
      activated: activated,
      admin: admin
    };
    this.http.post('http://localhost:3000/api/user/signup', user)
      .subscribe(response => {
        this.router.navigate(['/']);
        console.log(response);
      }, error => {
        console.log(error);
      });
  }

  getUsername() {
    return this.username;
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, name: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.username = response.name;
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          const status = {isAuth: true, username: response.name};
          this.authStatusListener.next(status);
          // Save the data in the browser for only a period of time
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(response.name, token, expirationDate);
          console.log(expirationDate);
          // Navigate to the homepage
          this.router.navigate(['/']);
        }
      }, error => {
        console.log(error);
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    // Evaluate when the time will expire from when the user is automatically logged in (milliseconds)
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.username = authInformation.username;
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next({isAuth: true, username: authInformation.username});
    }
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next({isAuth: false, username: this.username!});
    this.router.navigate(['/']);
    this.clearAuthData();
    // Clear timeout timer once logged out
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    // Logout after an hour
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Store token in local storage (browser storage)
  private saveAuthData(username: string, token: string, expirationDate: Date) {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  // Remove token from local storage (browser storage)
  private clearAuthData() {
    localStorage.removeItem('username');
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  // Read the token and exp. date from the browser storage
  private getAuthData() {
    const username = localStorage.getItem('username')!;
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      username: username,
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
