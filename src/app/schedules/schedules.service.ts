import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Course } from '../courses/course.model'

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
        return schData.schedules.map((sch: { name: string; courses: number; _id: string; creator: string }) => {
          return {
            name: sch.name,
            courses: sch.courses,
            id: sch._id,
            creator: sch.creator
          }
        });
      }))
      .subscribe((modSchedules) => {
        console.log(modSchedules);
        this.schedules = modSchedules;
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  getScheduleUpdateListener() {
    return this.schedulesUpdated.asObservable();
  }

  getSchedule(id: string) {
    return this.http.get<{_id: string, name: string, courses: number}>("http://localhost:3000/api/schedules/" + id);
  }

  addSchedule(name: string, courses: Array<Course>) {
    const schedule: Schedule = {
      id: "",
      name: name,
      courses: courses
    };
    this.http.post<{message: string, schId: string}>('http://localhost:3000/api/schedules', schedule)
      .subscribe((responseData) => {
        console.log(responseData.message);
        schedule.id = responseData.schId;
        this.schedules.push(schedule);
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  updateSchedule(id: string, schName: string, courses: Array<Course>) {
    const schedule: Schedule = { id: id, name: schName, courses: courses };
    this.http.put("http://localhost:3000/api/schedules/" + id, schedule)
      .subscribe(response => {
        const updatedSchedules = [...this.schedules];
        const oldScheduleIndex = updatedSchedules.findIndex(s => s.id === schedule.id);
        updatedSchedules[oldScheduleIndex] = schedule;
        this.schedules = updatedSchedules;
        this.schedulesUpdated.next([...this.schedules]);
      });
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
