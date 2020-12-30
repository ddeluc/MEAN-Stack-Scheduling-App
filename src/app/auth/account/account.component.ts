import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './account.component.html'
})
export class AccountComponent {
  private usersSub: Subscription | undefined;
  users: any;

  constructor(private authService: AuthService) {}

  onUpdatePassword(form: NgForm) {
    this.authService.getUsers();
    this.usersSub = this.authService.getUsersListener()
      .subscribe((users: any) => {
        this.users = users;
        console.log(this.users);
      });
  }
}
