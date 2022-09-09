import { Action, createReducer, on } from '@ngrx/store';
import { CoursesState } from '../interfaces/courses.state';
import * as CourseActions from './course.actions';

export const courseFeatureKey = 'course';

export const initialState: CoursesState = {
  loading: false,
  courses: [],
};

export const CourseReducer = createReducer(
  initialState,
  on(CourseActions.LoadCourses, (e) => {
    return { ...e, loading: true };
  }),
  on(CourseActions.CoursesLoaded, (e, { courses }) => {
    return { ...e, loading: false, courses: courses };
  })
);
