import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import { User } from 'src/app/user/models/user';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  sesionSubject!: BehaviorSubject<Sesion>;
  constructor(private _userService: UserService) {
    this.sesionSubject = new BehaviorSubject<Sesion>({
      active: false,
    });
  }

  login() {
    this._userService.getIdentity(true).subscribe({
      next: (user: any) => {
        if (user) {
          this.sesionSubject.next({ active: true, user: user });
        }
      },
      error: (err: any) => console.error(err),
    });
  }

  logout() {
    this._userService.logOut();
    this.sesionSubject.next({ active: false });
  }

  getSesion() {
    this.login();
    return this.sesionSubject.asObservable();
  }
}
