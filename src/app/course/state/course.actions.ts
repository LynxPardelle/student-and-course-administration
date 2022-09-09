import { createAction, props } from '@ngrx/store';
import { Course } from 'src/app/course/models/course';
export const LoadCourses = createAction('[Courses] Load Courses');
export const CoursesLoaded = createAction(
  '[Courses] Courses Loaded',
  props<{ courses: Course[] }>()
);
