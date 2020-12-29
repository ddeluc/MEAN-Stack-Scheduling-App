import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';

import { Course } from '../course.model';
import { CourseInfo } from '../courseInfo.model';
import { CourseService } from '../courses.service';

@Component({
  selector: "app-course-list",
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Array<Course> = [];
  private coursesSub: Subscription | undefined;

  constructor(public coursesService: CourseService) {}

  ngOnInit() {
    this.coursesSub = this.coursesService.getCourseUpdateListener()
      .subscribe((updatedCourses) => {
        this.courses = updatedCourses;
      })
  }

  onSearchKeyword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.coursesService.getCourses(form.value.keyword);
    console.log(form.value.keyword);
    // keyword = keyword.toUpperCase();
    // this.courses = this.courses.filter(course => course.subject.includes(keyword) || course.catalog_nbr.includes(keyword));
    // console.log(this.courses);
  }

  onSearch(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.coursesService.getCourse(form.value.subject, form.value.catalog_nbr);
  }
}

/*
<mat-accordion multi=true *ngIf="courses.length > 0">
  <mat-expansion-panel *ngFor="let course of courses">
    <mat-expansion-panel-header>
      {{ course.subject + " " + course.catalog_nbr}}
    </mat-expansion-panel-header>
    <p>{{ course.course_info.class_nbr }}</p>
  </mat-expansion-panel>
</mat-accordion>
 */
