import { createReducer, on } from '@ngrx/store';
import { CoursesState } from 'src/app/course/interfaces/courses.state';
import {
  LoadCourses,
  CoursesLoaded,
} from 'src/app/state/actions/course.actions';
const initialState: CoursesState = {
  loading: false,
  courses: [],
};

export const CourseReducer = createReducer(
  initialState,
  on(LoadCourses, (e) => {
    return { ...e, loading: true };
  }),
  on(CoursesLoaded, (e, { courses }) => {
    return { ...e, loading: false, courses: courses };
  })
);
