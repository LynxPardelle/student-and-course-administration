import { Action, createReducer, on } from '@ngrx/store';
import { UsersState } from '../interfaces/users.state';
import * as UserActions from './user.actions';
export const userFeatureKey = 'user';

export const initialState: UsersState = {
  loading: false,
  users: [],
};

export const UserReducer = createReducer(
  initialState,
  on(UserActions.LoadUsers, (s) => {
    return { ...s, loading: true };
  }),
  on(UserActions.UsersLoaded, (s, { users }) => {
    return { ...s, loading: false, users: users };
  })
);
