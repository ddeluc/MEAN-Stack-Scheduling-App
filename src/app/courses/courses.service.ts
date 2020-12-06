import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from './course.model';
import { CourseInfo } from './courseInfo.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private coursesUpdated = new Subject<Course[]>();

  constructor(private http: HttpClient) {}

  getCourses() {
    this.http.get<{message: string, courses: any}>('http://localhost:3000/api/courses')
    .pipe( map((courseData) => {
      return courseData.courses.map((cou: { catalog_nbr: string, subject: string, className: string, course_info: Array<CourseInfo>, _id: string }) => {
        const course: Course = {
          catalog_nbr: cou.catalog_nbr,
          subject: cou.subject,
          className: cou.className,
          course_info: cou.course_info[0]
        };
        return course;
      });
    }))
    .subscribe((updatedCourseData) => {
      this.courses = updatedCourseData;
      this.coursesUpdated.next(updatedCourseData);
    })
  }

  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }
}

