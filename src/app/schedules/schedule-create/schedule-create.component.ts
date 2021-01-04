import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from 'src/app/courses/courses.service';
import { Schedule } from '../schedule.model';
import { SchedulesService } from '../schedules.service';
import { Course } from '../../courses/course.model';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent implements OnInit {
  scheduleNameValue = '';
  schedule!: Schedule;
  addCourses: Array<Course> = [];
  private mode = 'create';
  private scheduleId: string | undefined;
  private coursesSub: Subscription | undefined;
  isVisible = true;

  constructor(public schedulesService: SchedulesService, public courseService: CourseService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('scheduleId')) {
        console.log("Edit Page.")
        const data = paramMap.get('scheduleId');
        if (data !== null)
          this.scheduleId = data;
          console.log(this.scheduleId);
          this.schedulesService.getSchedule(this.scheduleId!).subscribe((schedule: { _id: any; name: any; courses: any; date: {date: Date; seconds: number; }; visible: boolean; } ) => {
            this.schedule = {id: schedule._id, description: '', author: localStorage.getItem("username")!, name: schedule.name, courses: schedule.courses, date: schedule.date, visible: this.isVisible};
          });
        this.mode = 'edit';
      } else {
        console.log("Create Page.")
        this.mode = 'create';
        this.scheduleId = undefined;
      }
    });
  }

  onSaveSchedule(form: NgForm) {
    if (form.invalid)
      return;
    if (this.mode === 'create'){
      const author = localStorage.getItem("username")!;
      console.log(author);
      this.schedulesService.addSchedule(author, form.value.description, form.value.name, this.addCourses, this.isVisible);

    } else {
      const now = new Date();
      const seconds = now.getTime();
      this.schedulesService.updateSchedule(this.scheduleId!, localStorage.getItem("username")!, form.value.description, form.value.name, this.addCourses, {date: now, seconds: seconds}, this.isVisible );
    }
    this.addCourses = [];
    form.resetForm();
  }

  onAddCourse(form: NgForm) {
    if (form.invalid)
      return;
    this.coursesSub = this.courseService.getCourseUpdateListener()
      .subscribe((courses: Course[]) => {
        courses.forEach(course => {
          this.addCourses.push(course);
        });
      })
    this.courseService.getCourse(form.value.subject, form.value.catalog_nbr);
  }
}
