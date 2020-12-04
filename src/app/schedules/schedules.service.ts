import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Schedule } from './schedule.model';

// The injectable decorator makes the service a singleton
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private schedules: Schedule[] = [];
  private schedulesUpdated = new Subject<Schedule[]>();

  constructor(private http: HttpClient) {}

  getSchedules() {
    this.http.get<{message:string, schedules: Schedule[]}>('http://localhost:3000/api/schedules')
      .subscribe((schData) => {
        this.schedules = schData.schedules;
        this.schedulesUpdated.next([...this.schedules]);
      });
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
