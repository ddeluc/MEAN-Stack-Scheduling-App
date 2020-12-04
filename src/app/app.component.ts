import { Component } from '@angular/core';

import { Schedule } from './schedules/schedule.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedSchedules: Schedule[] = [];

  onScheduleAdded(schedule: Schedule) {
    this.storedSchedules.push(schedule);
  }
}
