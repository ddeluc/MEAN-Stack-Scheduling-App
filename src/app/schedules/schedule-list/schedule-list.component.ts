import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SchedulesService } from '../schedules.service';
import { Schedule } from '../schedule.model';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit, OnDestroy {
  // Listen for incoming data
  schedules: Schedule[] = [];
  private schedulesSub: Subscription | undefined;

  constructor(public schedulesService: SchedulesService) {}

  ngOnInit() {
    this.schedulesService.getSchedules();
    this.schedulesSub = this.schedulesService.getScheduleUpdateListener()
      .subscribe((schedules: Schedule[]) => {
        this.schedules = schedules;
      });
  }

  ngOnDestroy() {
    if (this.schedulesSub)
      this.schedulesSub.unsubscribe();
  }
}
