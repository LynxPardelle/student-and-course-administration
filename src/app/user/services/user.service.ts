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
    try {
      if (this.checkIfUserInterface(user)) {
        user.id = this.users.length;
        while (
          this.users.find((userO) => {
            return typeof userO.id === 'string'
              ? parseInt(userO.id) === user.id
              : userO.id === user.id;
          })
        ) {
          user.id++;
        }
        this.updateUsersList();
        return this._http.post<User>(`${this.api}/User/`, user);
      } else {
        throw new Error('Not a valid user.');
      }
    } catch (err) {
      console.error(err);
      return new Observable<any>((suscriptor) => {
        suscriptor.error(err);
      });
    }
  }

  // Read
  getUsers(): Observable<User[]> {
    this.updateUsersList();
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
      });
  }

  getUser(
    id: number | string,
    password: string | null = null
  ): Observable<User> {
    let userSubject: Subject<any> = new Subject();
    if (typeof id === 'number') {
      id.toString();
    }
    this._http
      .get<User>(`${this.api}/User/${id}`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .subscribe({
        next: (user) => {
          this.updateUsersList();
          if (!this.identity || this.identity.role !== 'admin') {
            user.password = '';
          }
          userSubject.next(user);
        },
        error: (error) => {
          this.updateUsersList();
          console.error(error);
        },
        complete: () => {
          this.updateUsersList();
          userSubject.complete();
        },
      });
    return userSubject.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    let userSubject: Subject<User> = new Subject();
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
            this.usersSubject.error('Email o contraseña incorrecta.');
          }
        },
        error: (error) => {
          this.usersSubject.error(error);
          console.error(error);
        },
        complete: () => userSubject.complete(),
      });
    return userSubject.asObservable();
  }

  // Update
  updateUser(user: User): Observable<User> {
    let userSubject: Subject<any> = new Subject();
    let userO = this.users.find((userO) => {
      return userO.id == user.id;
    });
    if (user.password === '' && userO && this.checkIfUserInterface(userO)) {
      user.password = userO.password;
    }
    if (user.password !== '') {
      this._http
        .put<User>(`${this.api}/User/${user.id.toString()}`, user)
        .subscribe({
          next: (user) => {
            this.updateUsersList();
            userSubject.next(user);
          },
          error: (err) => {
            this.updateUsersList();
            console.error(err);
            userSubject.error(err);
          },
          complete: () => {
            this.updateUsersList();
            userSubject.complete();
          },
        });
    } else {
      userSubject.error('La contraseña está vacía.');
    }
    return userSubject.asObservable();
  }

  // Delete
  deleteUser(id: number) {
    let userSubject: Subject<any> = new Subject();
    this._http.delete<User>(`${this.api}/User/${id.toString()}`).subscribe({
      next: () => {
        this.updateUsersList();
        userSubject.next('User deleted.');
      },
      error: (err) => {
        this.updateUsersList();
        console.error(err);
        userSubject.error(err);
      },
      complete: () => {
        this.updateUsersList();
        userSubject.complete();
      },
    });
    return userSubject.asObservable();
  }

  // Utility
  checkIfUserInterface(user: any): user is UserInterface {
    return (
      (<UserInterface>user).name !== undefined &&
      (<UserInterface>user).surname !== undefined &&
      (<UserInterface>user).email !== undefined &&
      (<UserInterface>user).password !== undefined &&
      (<UserInterface>user).role !== undefined
    );
  }

  getIdentity(
    suscriptorNeeded: boolean = false
  ): Observable<User> | void | any {
    let identitySubject: Subject<User | null> = new Subject();
    let identity: any = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      let id = identity.id;
      if (id) {
        if (suscriptorNeeded) {
          this.getUser(id).subscribe({
            next: (user: User) => {
              this.identity = user;
              localStorage.setItem(
                'identitySACA',
                JSON.stringify(this.identity)
              );
              identitySubject.next(this.identity);
              return this.identity;
            },
            error: (err: any) => {
              console.error(err);
              localStorage.removeItem('identitySACA');
              identitySubject.error(err);
            },
            complete: () => {
              identitySubject.next(this.identity);
              return this.identity;
            },
          });
          return identitySubject.asObservable();
        } else {
          return identity;
        }
      } else {
        localStorage.removeItem('identitySACA');
        identitySubject.next(null);
        if (!suscriptorNeeded) {
          return null;
        }
      }
    } else {
      localStorage.removeItem('identitySACA');
      identitySubject.next(null);
      if (!suscriptorNeeded) {
        return null;
      }
    }
    if (suscriptorNeeded) {
      return identitySubject.asObservable();
    }
  }

  logOut(): void {
    this.identity = null;
    localStorage.removeItem('identitySACA');
  }
}
