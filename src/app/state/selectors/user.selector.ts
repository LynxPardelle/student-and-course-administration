import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { UsersState } from 'src/app/user/interfaces/users.state';
export const userSelector = (state: AppState) => state.users;
export const LoadingUsersSelector = createSelector(
  userSelector,
  (state: UsersState) => state.loading
);

export const LoadedUsersSelector = createSelector(
  userSelector,
  (state: UsersState) => state.users
);
