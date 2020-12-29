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

  getCourses(keyword: string) {
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
      })
      .filter((course: any) => course.className.includes(keyword) || course.catalog_nbr.includes(keyword));
    }))
    .subscribe((updatedCourseData) => {
      this.courses = updatedCourseData;
      this.coursesUpdated.next(updatedCourseData);
    })
  }

  getCoursesFromKey(keyword: string) {
    const updatedCourses = this.courses.filter(course => course.subject.includes(keyword) || course.catalog_nbr.includes(keyword));
    this.courses = updatedCourses;
    this.coursesUpdated.next(updatedCourses);
  }

  getCourse(subject: string, catalog_nbr: string) {
    this.http.get<{message: string, course: any}>('http://localhost:3000/api/courses/' + subject + '/' + catalog_nbr)
    .pipe( map((courseData) => {
      const updatedCourse = {
        catalog_nbr: courseData.course.catalog_nbr,
        subject: courseData.course.subject,
        className: courseData.course.className,
        course_info: courseData.course.course_info[0]
      }
      return updatedCourse;
    }))
    .subscribe((updatedCourseData) => {
      console.log(updatedCourseData)
      this.courses = [ updatedCourseData ];
      this.coursesUpdated.next(this.courses);
    })
  }

  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }
}

