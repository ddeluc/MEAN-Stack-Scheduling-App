import { Component } from '@angular/core'
import { NgForm } from '@angular/forms';

import { SchedulesService } from '../schedules.service';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent {
  scheduleNameValue = '';

  constructor(public schedulesService: SchedulesService) {}

  onCreateSchedule(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.schedulesService.addSchedule(form.value.name);
    form.resetForm();
  }
}
