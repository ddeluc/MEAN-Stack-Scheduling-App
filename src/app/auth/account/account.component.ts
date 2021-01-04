import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Schedule } from 'src/app/schedules/schedule.model';
import { SchedulesService } from 'src/app/schedules/schedules.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private usersSub: Subscription | undefined;
  private schedulesSub: Subscription | undefined;
  isAdmin = false;
  username = localStorage.getItem('username');
  users: any;
  schedules: Schedule[] = [];

  constructor(private authService: AuthService, private schedulesService: SchedulesService) {}

  ngOnInit(): void {
    this.schedules = [];
    this.authService.getUsers();
    this.usersSub = this.authService.getUsersListener()
      .subscribe((users: any) => {
        this.users = users;
      });
    this.isAdmin = localStorage.getItem('admin') == 'yes' ? true : false;
    this.schedulesService.getSchedules();
    this.schedulesSub = this.schedulesService.getScheduleUpdateListener()
      .subscribe((schedules: Schedule[]) => {
        schedules.forEach(sch => {
          if(sch.author == this.username) {
            this.schedules!.push(sch);
          }
        });
      });
  }

  onSave() {
    this.users.forEach((user: any) => {
      this.authService.updateUser(user._id, user.name, user.email, user.password, user.activated, user.admin);
    });
  }

  onDelete(schId: string) {
    console.log(">>>>>>" + schId)
    this.schedulesService.deleteSchedule(schId);
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
