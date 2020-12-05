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
    this.http.get<{message: string, schedules: any}>('http://localhost:3000/api/schedules')
      .pipe( map((schData) => {
        return schData.schedules.map((sch: { name: string; courses: number; _id: string; }) => {
          return {
            name: sch.name,
            courses: sch.courses,
            id: sch._id
          }
        });
      }))
      .subscribe((modSchedules) => {
        this.schedules = modSchedules;
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  getScheduleUpdateListener() {
    return this.schedulesUpdated.asObservable();
  }

  // Retrieve schedule from local array
  getSchedule(name: string): Schedule {
    const sch: Schedule = {...this.schedules.find(sch => sch.name === name)} as Schedule;
    return sch;
  }

  addSchedule(name: string) {
    const schedule: Schedule = {
      id: "",
      name: name,
      courses: 0
    };
    this.http.post<{message: string, schId: string}>('http://localhost:3000/api/schedules', schedule)
      .subscribe((responseData) => {
        console.log(responseData.message);
        schedule.id = responseData.schId;
        this.schedules.push(schedule);
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  updateSchedule(id: string, schName: string) {
    const schedule: Schedule = { id: id, name: schName, courses: 0};
    this.http.put("http://localhost:3000/api/schedules/" + id, schedule)
      .subscribe(response => console.log(response));
  }

  deleteSchedule(schId: string) {
    this.http.delete('http://localhost:3000/api/schedules/' + schId)
      .subscribe(() => {
        const updatedSchedules = this.schedules.filter(schedule => schedule.id !== schId)
        this.schedules = updatedSchedules;
        this.schedulesUpdated.next([...this.schedules])
      });
  }
}
