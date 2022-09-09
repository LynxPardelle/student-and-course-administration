import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* RxJs */
import { firstValueFrom, lastValueFrom, map, Observable, Subject } from 'rxjs';

/* Environments */
import { environment } from 'src/environments/environment';

/* Interfaces */
import UserInterface from 'src/app/user/interfaces/user';

/* Models */
import { User } from 'src/app/user/models/user';
import { UsersState } from '../interfaces/users.state';

/* Store */
import { Store } from '@ngrx/store';
import { LoadUsers } from '../state/user.actions';
import { LoadedUsersSelector } from '../state/user.selectors';
import { AppState } from 'src/app/state/app.state';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users$: Observable<User[]>;
  public sesion$: Observable<User | undefined>;
  public access: string = 'public';
  private readonly api = environment.api;

  constructor(
    private _http: HttpClient,
    private store: Store<AppState>,
    private usersStore: Store<UsersState>
  ) {
    this.users$ = this.usersStore.select(LoadedUsersSelector);

    this.sesion$ = this.store.select(IdentitySesionSelector);
    this.sesion$.subscribe({
      next: (i) => {
        this.access = i?.role ? i.role : 'public';
      },
      error: (err) => {
        console.error(err);
        this.access = 'public';
      },
    });
  }

  // Create
  async register(user: User): Promise<User> {
    while (
      await firstValueFrom(
        this.users$.pipe(
          map((users: User[]) => {
            return users.find((u) => u.id == user.id);
          })
        )
      )
    ) {
      user.id++;
    }
    return lastValueFrom(this._http.post<User>(`${this.api}/User/`, user));
  }

  // Read
  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this.api}/User`, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        encoding: 'UTF-8',
      }),
    });
  }

  getUser(id: number, reset: boolean = false): Observable<User> {
    return this._http
      .get<User>(`${this.api}/User/${id}`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(
        map((u: User) => {
          if (typeof u.id === 'string') {
            u.id = parseInt(u.id);
          }
          if (this.access !== 'admin') {
            u.password = '';
          }
          return u;
        })
      );
  }

  login(email: string, password: string): Observable<User> {
    return this._http
      .get<User[]>(`${this.api}/User`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(
        map((users: User[]) => {
          let user2Log = users.find(
            (u) => u.email === email && u.password === password
          );
          if (user2Log) {
            return user2Log;
          } else {
            throw new Error('Usuario o contraseña incorrectos.');
          }
        })
      );
  }

  // Update
  async updateUser(user: User): Promise<User> {
    let u = await firstValueFrom(
      this.users$.pipe(
        map((users: User[]) => {
          return users.find((u) => u.id == user.id);
        })
      )
    );
    if (user.password === '' && u) {
      user.password = u.password;
    }
    if (user.password !== '') {
      return lastValueFrom(
        this._http.put<User>(`${this.api}/User/${user.id.toString()}`, user)
      );
    } else {
      throw new Error('La contraseña está vacía.');
    }
  }

  // Delete
  deleteUser(id: number): Observable<any> {
    return this._http.delete<User>(`${this.api}/User/${id.toString()}`).pipe(
      map((u) => {
        this.usersStore.dispatch(LoadUsers());
        return u;
      })
    );
  }

  // Utility
  checkIfUserInterface(user: any): user is UserInterface {
    return (
      <UserInterface>user !== undefined &&
      (<UserInterface>user).id !== undefined &&
      (<UserInterface>user).name !== undefined &&
      (<UserInterface>user).surname !== undefined &&
      (<UserInterface>user).email !== undefined &&
      (<UserInterface>user).password !== undefined &&
      (<UserInterface>user).role !== undefined
    );
  }
}
