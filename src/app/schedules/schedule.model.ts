import { Course } from '../courses/course.model'

// Blueprint for schedule
export interface Schedule {
  author: string;
  description: any;
  id: string;
  name: string;
  courses: Array<Course>;
}
