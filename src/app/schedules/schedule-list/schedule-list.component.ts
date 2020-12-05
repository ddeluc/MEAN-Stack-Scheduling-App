import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SchedulesService } from '../schedules.service';
import { Schedule } from '../schedule.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit, OnDestroy {
  // Listen for incoming data
  schedules: Schedule[] = [];
  public userIsAuthenticated = false;
  private schedulesSub: Subscription | undefined;
  private authStatusSub: Subscription | undefined;

  constructor(public schedulesService: SchedulesService, private authService: AuthService) {}


  ngOnInit() {
    this.schedulesService.getSchedules();
    this.schedulesSub = this.schedulesService.getScheduleUpdateListener()
      .subscribe((schedules: Schedule[]) => {
        this.schedules = schedules;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDelete(schId: string) {
    console.log(">>>>>>" + schId)
    this.schedulesService.deleteSchedule(schId);
  }

  ngOnDestroy() {
    if (this.schedulesSub)
      this.schedulesSub.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }
}
