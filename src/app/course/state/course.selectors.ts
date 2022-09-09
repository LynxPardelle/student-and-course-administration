import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCourse from './course.reducer';
import { CoursesState } from 'src/app/course/interfaces/courses.state';

export const CourseSelector = createFeatureSelector<CoursesState>(
  fromCourse.courseFeatureKey
);

export const LoadingCoursesSelector = createSelector(
  CourseSelector,
  (state: CoursesState) => state.loading
);

export const LoadedCoursesSelector = createSelector(
  CourseSelector,
  (state: CoursesState) => state.courses
);
