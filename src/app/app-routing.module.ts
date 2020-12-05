import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup';
import { ScheduleCreateComponent } from './schedules/schedule-create/schedule-create.component';
import { ScheduleListComponent } from './schedules/schedule-list/schedule-list.component';

// Define routes
const routes: Routes = [
  { path: '', component: ScheduleListComponent },
  { path: 'create', component: ScheduleCreateComponent},
  { path: 'edit/:scheduleId', component: ScheduleCreateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
