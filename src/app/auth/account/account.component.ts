import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private usersSub: Subscription | undefined;
  isAdmin = false;
  users: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers();
    this.usersSub = this.authService.getUsersListener()
      .subscribe((users: any) => {
        this.users = users;
      });
    this.isAdmin = localStorage.getItem('admin') == 'yes' ? true : false;
  }

  onUpdatePassword(form: NgForm) {
    this.authService.getUsers();
    this.usersSub = this.authService.getUsersListener()
      .subscribe((users: any) => {
        this.users = users;
        console.log(this.users);
      });
  }
}
