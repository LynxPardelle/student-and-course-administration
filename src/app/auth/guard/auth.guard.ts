import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  CanActivateChild,
  CanDeactivate,
  Router,
  Route,
  UrlSegment,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppState } from 'src/app/state/app.state';
import { SesionSelector } from 'src/app/state/selectors/sesion.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanLoad, CanActivateChild, CanDeactivate<unknown>
{
  constructor(
    private store: Store<AppState>,
    private auth: AuthService,
    private router: Router
  ) {}

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

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
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

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
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
