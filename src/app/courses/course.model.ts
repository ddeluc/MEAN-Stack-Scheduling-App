import { CourseInfo } from './courseInfo.model';

export interface Course {
  catalog_nbr: string,
  subject: string,
  className: string,
  course_info: Array<CourseInfo>
}
