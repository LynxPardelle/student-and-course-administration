import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import * as UserActions from './user.actions';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Injectable()
export class UserEffects {
  LoadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.LoadUsers),
      mergeMap(() =>
        this._userService.getUsers().pipe(
          map((u: User[]) => {
            u = u.map((user) => {
              if (typeof user.id === 'string') {
                user.id = parseInt(user.id);
              }
              user.password = '';
              return user;
            });
            return UserActions.UsersLoaded({ users: u });
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private _userService: UserService) {}
}
