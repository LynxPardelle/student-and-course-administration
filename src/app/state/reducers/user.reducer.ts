import { createReducer, on } from '@ngrx/store';
import { UsersState } from 'src/app/user/interfaces/users.state';
import {
  loadUsers,
  UsersLoaded,
} from 'src/app/state/actions/user.actions';
const initialState: UsersState = {
  loading: false,
  users: [],
};

export const UserReducer = createReducer(
  initialState,
  on(loadUsers, (s) => {
    return { ...s, loading: true };
  }),
  on(UsersLoaded, (s, { users }) => {
    return { ...s, loading: false, users: users };
  })
);
