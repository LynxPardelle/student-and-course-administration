import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CoursesState } from 'src/app/course/interfaces/courses.state';
export const courseSelector = (state: AppState) => state.courses;
export const loadingCoursesSelector = createSelector(
  courseSelector,
  (state: CoursesState) => state.loading
);

export const loadedCoursesSelector = createSelector(
  courseSelector,
  (state: CoursesState) => state.courses
);
