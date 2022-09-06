import { ActionReducerMap } from '@ngrx/store';
import { CoursesState } from 'src/app/course/interfaces/courses.state';
import { CourseReducer } from './reducers/course.reducer';
import { UsersState } from 'src/app/user/interfaces/users.state';
import { UserReducer } from 'src/app/state/reducers/user.reducer';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import { SesionReducer } from './reducers/sesion.reducer';
export interface AppState {
  courses: CoursesState;
  users: UsersState;
  sesion: Sesion;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  courses: CourseReducer,
  users: UserReducer,
  sesion: SesionReducer,
};
