import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/user/models/user';

export const loadUsers = createAction('[Users] Load Users');
export const UsersLoaded = createAction(
  '[Users] Users Loaded',
  props<{ users: User[] }>()
);
