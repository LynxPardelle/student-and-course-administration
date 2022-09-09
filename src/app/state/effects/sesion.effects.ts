import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SesionActions from '../actions/sesion.actions';
import { User } from 'src/app/user/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ environment} from 'src/environments/environment';

@Injectable()
export class SesionEffects {
  private readonly api = environment.api;

  LoadSesion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SesionActions.LoadSesion),
      mergeMap(() => {
        let identitySACA: string | null = localStorage.getItem('identitySACA');
        if (identitySACA !== null) {
          return this._http
            .get<User>(`${this.api}/User/${identitySACA}`, {
              headers: new HttpHeaders({
                'content-type': 'application/json',
                encoding: 'UTF-8',
              }),
            })
            .pipe(
              map((u: User) => {
                localStorage.setItem('identitySACA', u.id.toString());
                if (typeof u.id === 'string') {
                  u.id = parseInt(u.id);
                }
                u.password = '';
                return SesionActions.SesionLoaded({
                  sesion: { active: true, identity: u },
                });
              }),
              catchError(() => of(SesionActions.ErrorSesion()))
            );
        } else {
          return of(SesionActions.SesionLoaded({ sesion: { active: false } }));
        }
      })
    )
  );

  constructor(private actions$: Actions, private _http: HttpClient) {}
}
