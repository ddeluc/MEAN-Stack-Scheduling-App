import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './auth/account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { ReviewsComponent } from './courses/reviews/reviews.component';
import { ScheduleCreateComponent } from './schedules/schedule-create/schedule-create.component';
import { ScheduleListComponent } from './schedules/schedule-list/schedule-list.component';

// Define routes
const routes: Routes = [
  { path: '', component: ScheduleListComponent },
  // Guard these two paths
  // Redirect an unauth to 'login' user that tries to manually enter these routes
  { path: 'create', component: ScheduleCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:scheduleId', component: ScheduleCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: AccountComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'review/:courseId/:subject/:catalog_nbr', component: ReviewsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
