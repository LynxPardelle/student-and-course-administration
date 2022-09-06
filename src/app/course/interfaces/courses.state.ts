import { Course } from 'src/app/course/models/course';
export interface CoursesState {
  loading: boolean;
  courses: Course[];
}
