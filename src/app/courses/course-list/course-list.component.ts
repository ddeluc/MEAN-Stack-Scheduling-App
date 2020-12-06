import { Component, OnInit } from '@angular/core';

import { Course } from '../course.model';
import { CourseInfo } from '../courseInfo.model';
import { CourseService } from '../courses.service';

@Component({
  selector: "app-course-list",
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: Array<Course> = [];

  constructor(public coursesService: CourseService) {}

  ngOnInit() {
    this.coursesService.getCourses();
  }

}
