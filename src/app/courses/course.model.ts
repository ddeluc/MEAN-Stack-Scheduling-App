import { CourseInfo } from './courseInfo.model';

export interface Course {
  id: string,
  catalog_nbr: string,
  subject: string,
  className: string,
  course_info: CourseInfo
}
