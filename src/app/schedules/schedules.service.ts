import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Schedule } from './schedule.model';

// The injectable decorator makes the service a singleton
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private schedules: Schedule[] = [];
  private schedulesUpdated = new Subject<Schedule[]>();

  getSchedules() {
    // Pass by value, not reference
    return [...this.schedules];
  }

  getScheduleUpdateListener() {
    return this.schedulesUpdated.asObservable();
  }

  addSchedule(name: string) {
    const schedule: Schedule = {
      name: name,
      courses: 0
    };
    this.schedules.push(schedule);
    this.schedulesUpdated.next([...this.schedules]);
  }
}
