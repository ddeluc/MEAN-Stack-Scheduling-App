import { Component, OnInit } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';

import { Course } from '../course.model';
import { CourseInfo } from '../courseInfo.model';
import { CourseService } from '../courses.service';

@Component({
  selector: "app-course-list",
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: Array<Course> = [];
  private coursesSub: Subscription | undefined;

  constructor(public coursesService: CourseService) {}

  ngOnInit() {
    this.coursesService.getCourses();
    this.coursesSub = this.coursesService.getCourseUpdateListener()
      .subscribe((updatedCourses) => {
        this.courses = updatedCourses;
        console.log(this.courses);
      })
  }

}
