import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import {
  InactiveSesion,
  ActiveSesion,
} from 'src/app/state/actions/sesion.actions';
import { AppState } from 'src/app/state/app.state';
import { SesionSelector } from 'src/app/state/selectors/sesion.selector';
import { User } from 'src/app/user/models/user';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public identity: User | null = null;
  public identity$!: Observable<User>;
  public sesion$!: Observable<Sesion>;
  sesionSubject!: BehaviorSubject<Sesion>;
  constructor(
    private store: Store<AppState>,
    private _userService: UserService
  ) {
    this.store.dispatch(InactiveSesion());
    this.sesion$ = this.store.select(SesionSelector);
    this.sesionSubject = new BehaviorSubject<Sesion>({
      active: false,
    });
    this.sesion$.subscribe({
      next: (a) => this.sesionSubject.next(a),
      error: (e) => this.sesionSubject.error(e),
      complete: () => this.sesionSubject.complete(),
    });
  }

  logOut(): void {
    this.store.dispatch(InactiveSesion());
    localStorage.removeItem('identitySACA');
  }

  checkForSesion(): void {
    let identitySACA: string | null = localStorage.getItem('identitySACA');
    let identityId: number | null =
      this.identity !== null && this.identity.id
        ? this.identity.id
        : identitySACA !== null && !identitySACA.includes('{')
        ? parseInt(identitySACA)
        : identitySACA !== null &&
          identitySACA.includes('{') &&
          JSON.parse(identitySACA).id
        ? JSON.parse(identitySACA).id
        : null;
    if (identityId !== null) {
      this._userService.getUser(identityId).subscribe({
        next: (user: User) => {
          this.store.dispatch(
            ActiveSesion({ sesion: { active: true, identity: user } })
          );
          this.identity = user;
          localStorage.setItem('identitySACA', this.identity.id.toString());
        },
        error: (err: any) => {
          this.store.dispatch(InactiveSesion());
          if (identitySACA) {
            localStorage.removeItem('identitySACA');
          }
        },
        complete: () => {},
      });
    } else {
      this.store.dispatch(InactiveSesion());
      if (identitySACA) {
        localStorage.removeItem('identitySACA');
      }
    }
  }
}
