import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

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
    this.http.get<{message:string, schedules: any}>('http://localhost:3000/api/schedules')
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
    this.http.post<{message: string}>('http://localhost:3000/api/schedules', schedule)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.schedules.push(schedule);
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  deleteSchedule(schName: string) {
    this.http.delete('http://localhost:3000/api/schedules/' + schName)
      .subscribe(() => {
        const updatedSchedules = this.schedules.filter(schedule => schedule.name !== schName)
        this.schedules = updatedSchedules;
        this.schedulesUpdated.next([...this.schedules])
      });
  }
}
