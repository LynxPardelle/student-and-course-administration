import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from '../interfaces/users.state';
import * as fromUser from './user.reducer';

export const UserSelector = createFeatureSelector<UsersState>(
  fromUser.userFeatureKey
);

export const LoadingUsersSelector = createSelector(
  UserSelector,
  (state: UsersState) => state.loading
);

export const LoadedUsersSelector = createSelector(
  UserSelector,
  (state: UsersState) => state.users
);
