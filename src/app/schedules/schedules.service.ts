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
        return schData.schedules.map((sch: { name: string; author: string; description: any; courses: number; _id: string; creator: string; date: {date: Date, seconds: number } }) => {
          return {
            name: sch.name,
            author: sch.author,
            description: sch.description,
            courses: sch.courses,
            id: sch._id,
            creator: sch.creator,
            date: sch.date
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
    return this.http.get<{_id: string, name: string, courses: number, date: {date: Date, seconds: number}}>("http://localhost:3000/api/schedules/" + id);
  }

  addSchedule(author: string, description: any, name: string, courses: Array<Course>) {
    const now = new Date();
    const seconds = now.getTime();
    const schedule: Schedule = {
      id: "",
      author: author,
      description: description,
      name: name,
      courses: courses,
      date: { date: now, seconds: seconds }
    };
    this.http.post<{message: string, schId: string}>('http://localhost:3000/api/schedules', schedule)
      .subscribe((responseData) => {
        console.log(responseData.message);
        schedule.id = responseData.schId;
        this.schedules.push(schedule);
        this.schedulesUpdated.next([...this.schedules]);
      });
  }

  updateSchedule(id: string, author: string, description: any, schName: string, courses: Array<Course>, date: { date: Date; seconds: number; }) {
    const schedule: Schedule = { id: id, author: author, description: description, name: schName, courses: courses, date: date };
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
