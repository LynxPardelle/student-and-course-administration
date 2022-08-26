import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/user/models/user';
import UserInterface from 'src/app/user/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users: User[] = [
    {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    },
    {
      id: 1,
      name: 'Alec',
      surname: 'Montaño',
      email: 'alec@example.com',
      password: 'passwordAlec',
      role: 'profesor',
    },
    {
      id: 2,
      name: 'Lucy',
      surname: 'Morning Star',
      email: 'lucy@morning-star.com',
      password: '616',
      role: 'user',
    },
    {
      id: 87,
      name: 'Pancho',
      surname: 'Lopez',
      email: 'pancho@gmail.com',
      password: '',
      role: 'user',
    },
    {
      id: 69,
      name: 'Ang',
      surname: 'Perez',
      email: 'ang@gmail.com',
      password: '',
      role: 'profesor',
    },
  ];
  public identity: any;

  constructor() {}

  // Create
  register(user: User): Observable<any> {
    return new Observable<any>((suscriptor) => {
      try {
        if (this.checkIfUserInterface(user)) {
          user.id = this.users.length;
          const chekIfUser = (id: number) => {
            let hasIt: boolean = false;
            for (let user of this.users) {
              if (user.id === id) {
                hasIt = true;
              }
            }
            if (hasIt === false) {
              return false;
            } else {
              return true;
            }
          };
          while (chekIfUser(user.id)) {
            user.id++;
          }
          this.users.push(user);
          suscriptor.next(this.users[user.id]);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid user.');
        }
      } catch (err) {
        suscriptor.error('Error.');
        console.error(err);
      }
    });
  }

  // Read
  getUsers(): Observable<any> {
    return new Observable<any>((suscriptor) => {
      try {
        let users = this.users;
        this.getIdentity();
        if (!this.identity || this.identity.role !== 'admin') {
          for (let user of users) {
            user.password = '';
          }
        }
        suscriptor.next(users);
        suscriptor.complete();
      } catch (err) {
        suscriptor.error('Error.');
        console.error(err);
      }
    });
  }

  getUser(
    id: number | string,
    password: string | null = null
  ): Observable<any> {
    return new Observable<any>((suscriptor) => {
      try {
        if (typeof id === 'number') {
          let i: number = -1;
          console.log(this.users);
          for (let user of this.users) {
            if (user.id === id) {
              i = this.users.indexOf(user);
            }
          }
          if (this.users[i]) {
            let user = this.users[i];
            console.log(user);
            this.getIdentity();
            if (!this.identity || this.identity.role !== 'admin') {
              user.password = '';
            }
            suscriptor.next(user);
            suscriptor.complete();
          } else {
            throw new Error('Not a valid user.');
          }
        } else if (typeof id === 'string') {
          let myUser: User | null = null;
          for (let user of this.users) {
            if (user.email === id && user.password === password) {
              myUser = user;
            }
          }
          if (myUser === null) {
            throw new Error('Not a valid user.');
          }
          console.log(myUser);
          this.getIdentity();
          if (!this.identity || this.identity.role !== 'admin') {
            myUser.password = '';
          }
          suscriptor.next(myUser);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid user.');
        }
      } catch (err) {
        console.error(err);
        suscriptor.error('Error.');
      }
    });
  }

  // Update
  updateUser(user: User) {
    return new Observable<any>((suscriptor) => {
      try {
        let id = user.id;
        let i = -1;
        for (let user2check of this.users) {
          if (user2check.id === id) {
            i = this.users.indexOf(user2check);
          }
        }
        if (i !== -1) {
          let oldPassword = this.users[i].password;
          this.users[i] = user;
          if (this.users[i].password === '') {
            this.users[i].password = oldPassword;
          }
          let updatedUser = this.users[i];
          this.getIdentity();
          if (!this.identity || this.identity.role !== 'admin') {
            updatedUser.password = '';
          }
          suscriptor.next(updatedUser);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid user.');
        }
      } catch (err) {
        suscriptor.error('Error.');
        console.error(err);
      }
    });
  }

  // Delete
  deleteUser(id: number) {
    return new Observable<any>((suscriptor) => {
      try {
        let i = -1;
        for (let user2check of this.users) {
          if (user2check.id === id) {
            i = this.users.indexOf(user2check);
          }
        }
        if (i !== -1) {
          this.users.splice(i, 1);
          suscriptor.next('User deleted.');
          suscriptor.complete();
        } else {
          throw new Error('Not a valid user.');
        }
      } catch (err) {
        suscriptor.error('Error');
        console.error(err);
      }
    });
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

  getIdentity() {
    let identity = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      this.identity = identity;
      return identity;
    } else {
      return null;
    }
  }
}
