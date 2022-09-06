import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/user/models/user';
import UserInterface from 'src/app/user/interfaces/user';
import Enviroment from 'src/app/environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users: User[] = [];
  public usersSubject: Subject<any> = new Subject();
  public identity: any;
  private api = Enviroment.api;

  constructor(private _http: HttpClient) {}

  // Create
  register(user: User): Observable<any> {
    while (this.users.find((u) => u.id == user.id)) {
      user.id++;
    }
    setTimeout(() => {
      this.updateUsersList();
    }, 1);
    return this._http.post<User>(`${this.api}/User/`, user);
  }

  // Read
  getUsers(): Observable<User[]> {
    setTimeout(() => {
      this.updateUsersList();
    }, 1);
    return this.usersSubject.asObservable();
  }

  updateUsersList(): void {
    this._http
      .get<User[]>(`${this.api}/User`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .subscribe({
        next: (users) => {
          this.users = users.map((user) => {
            if (typeof user.id === 'string') {
              user.id = parseInt(user.id);
            }
            if (!this.identity || this.identity.role !== 'admin') {
              user.password = '';
            }
            return user;
          });
          this.usersSubject.next(this.users);
        },
        error: (err) => {
          this.users = [];
          console.error(err);
          this.usersSubject.next(this.users);
          this.usersSubject.error('Error.');
        },
        complete: () => {
          this.usersSubject.complete();
        },
      });
  }

  getUser(id: number, reset: boolean = false): Observable<User> {
    let userSubject: Subject<any> = new Subject();
    setTimeout(() => {
      this._http
        .get<User>(`${this.api}/User/${id}`, {
          headers: new HttpHeaders({
            'content-type': 'application/json',
            encoding: 'UTF-8',
          }),
        })
        .subscribe({
          next: (user) => {
            if (!this.identity || this.identity.role !== 'admin') {
              user.password = '';
            }
            userSubject.next(user);
          },
          error: (error) => {
            console.error(error);
            userSubject.error(error);
          },
          complete: () => {
            userSubject.complete();
          },
        });
    }, 1);
    return userSubject.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    let userSubject: Subject<User> = new Subject();
    setTimeout(() => {
      this._http
        .get<User[]>(`${this.api}/User`, {
          headers: new HttpHeaders({
            'content-type': 'application/json',
            encoding: 'UTF-8',
          }),
        })
        .subscribe({
          next: (users) => {
            let user2Log = users.find(
              (u) => u.email === email && u.password === password
            );
            if (user2Log) {
              userSubject.next(user2Log);
            } else {
              userSubject.error('Email o contraseña incorrecta.');
            }
          },
          error: (error) => {
            console.error(error);
            userSubject.error(error);
          },
          complete: () => userSubject.complete(),
        });
    }, 100);
    return userSubject.asObservable();
  }

  // Update
  updateUser(user: User, reset: boolean = false): Observable<User> {
    let userSubject: Subject<any> = new Subject();
    setTimeout(() => {
      let userO = this.users.find((u) => u.id == user.id);
      if (user.password === '' && userO) {
        user.password = userO.password;
      }
      if (user.password !== '') {
        this._http
          .put<User>(`${this.api}/User/${user.id.toString()}`, user)
          .subscribe({
            next: (user) => {
              userSubject.next(user);
              if (reset) {
                this.updateUsersList();
              }
            },
            error: (err) => {
              console.error(err);
              userSubject.error(err);
            },
            complete: () => {
              userSubject.complete();
            },
          });
      } else {
        userSubject.error('La contraseña está vacía.');
      }
    }, 1);
    return userSubject.asObservable();
  }

  // Delete
  deleteUser(id: number, reset: boolean = false): Observable<any> {
    let userSubject: Subject<any> = new Subject();
    setTimeout(() => {
      this._http.delete<User>(`${this.api}/User/${id.toString()}`).subscribe({
        next: () => {
          userSubject.next('User deleted.');
          if (reset) {
            this.updateUsersList();
          }
        },
        error: (err) => {
          console.error(err);
          userSubject.error(err);
          if (reset) {
            this.updateUsersList();
          }
        },
        complete: () => {
          userSubject.complete();
          if (reset) {
            this.updateUsersList();
          }
        },
      });
    }, 1);
    return userSubject.asObservable();
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
