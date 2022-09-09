import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  Route,
  UrlSegment,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

/* RxJs */
import { map, Observable } from 'rxjs';

/* Interfaces */
import { Sesion } from 'src/app/auth/interfaces/sesion';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { SesionSelector } from 'src/app/state/selectors/sesion.selector';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(SesionSelector).pipe(
      map((sesion: Sesion) => {
        if (sesion.active) {
          return true;
        } else {
          this.router.navigate(['auth/login']);
          return false;
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(SesionSelector).pipe(
      map((sesion: Sesion) => {
        if (sesion.active) {
          return true;
        } else {
          this.router.navigate(['auth/login']);
          return false;
        }
      })
    );
  }
}
