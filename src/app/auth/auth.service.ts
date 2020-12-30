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
  private adminStatusUpdated = new Subject<{adminStatus: boolean}>();
  private usersUpdated = new Subject<{users: any}>();
  private users: any;
  private tokenTimer: any;
  private username: string | undefined;
  private isActivated: string | undefined;

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

  adminStatusListener() {
    return this.adminStatusUpdated.asObservable();
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

  updateUser(id: string, name: string, email: string, password: string, activated: boolean, admin: boolean) {
    const user = {name: name, email: email, password: password, activated: activated, admin: admin};
    this.http.put('http://localhost:3000/api/user/' + id, user)
      .subscribe((response) => {
        console.log("Updated users.");
        console.log(response);
      })
  }

  getUsers() {
    console.log("Getting users ...")
    this.http.get<{ message: string, users: any}>('http://localhost:3000/api/user')
      .subscribe((response) => {
        this.users = response.users;
        this.usersUpdated.next(response.users);
      })
  }

  getUsersListener() {
    return this.usersUpdated.asObservable();
  }

  getUsername() {
    return this.username;
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, name: string, activated: string, admin: boolean }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          this.username = response.name;
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.isActivated = response.activated;
          const status = {isAuth: true, username: response.name};
          const adminUpdate = {adminStatus: response.admin};
          this.adminStatusUpdated.next(adminUpdate);
          this.authStatusListener.next(status);
          // Save the data in the browser for only a period of time
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(response.name, token, expirationDate, response.activated, response.admin);
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
    this.adminStatusUpdated.next({adminStatus: false});
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
  private saveAuthData(username: string, token: string, expirationDate: Date, activated: string, admin: boolean) {
    localStorage.setItem('status', activated);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('admin', admin ? 'yes' : 'no');
  }

  // Remove token from local storage (browser storage)
  private clearAuthData() {
    localStorage.removeItem('status');
    localStorage.removeItem('username');
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('admin');
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
