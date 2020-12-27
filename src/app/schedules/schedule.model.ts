import { Course } from '../courses/course.model'

// Blueprint for schedule
export interface Schedule {
  id: string;
  name: string;
  courses: Array<Course>;
}
