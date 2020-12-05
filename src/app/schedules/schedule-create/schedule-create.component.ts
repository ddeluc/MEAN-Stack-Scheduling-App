import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Schedule } from '../schedule.model';

import { SchedulesService } from '../schedules.service';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent implements OnInit {
  scheduleNameValue = '';
  schedule!: Schedule;
  private mode = 'create';
  private scheduleId: string | undefined;

  constructor(public schedulesService: SchedulesService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('scheduleId')) {
        console.log("Edit Page.")
        const data = paramMap.get('scheduleId');
        if (data !== null)
          this.scheduleId = data;
          console.log(this.scheduleId);
          this.schedulesService.getSchedule(this.scheduleId!).subscribe((schedule: { _id: any; name: any; courses: any; }) => {
            this.schedule = {id: schedule._id, name: schedule.name, courses: schedule.courses};
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
      this.schedulesService.addSchedule(form.value.name);
    } else {
      this.schedulesService.updateSchedule(this.scheduleId!, form.value.name)
    }
    form.resetForm();
  }
}
