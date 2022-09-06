import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { User } from 'src/app/user/models/user';
import { of } from 'rxjs';

describe('UserService', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };
  let service: UserService;
  const mockData: any[] = [
    {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    },
    {
      id: '1',
      name: 'Alec',
      surname: 'Montaño',
      email: 'alec@example.com',
      password: 'passwordAlec',
      role: 'profesor',
    },
    {
      id: '2',
      name: 'Lucy',
      surname: 'Morning Star',
      email: 'lucy@morning-star.com',
      password: '616',
      role: 'user',
    },
    {
      id: '4',
      name: 'Pancho',
      surname: 'Lopez',
      email: 'pancho@gmail.com',
      password: '1234',
      role: 'user',
    },
    {
      id: '5',
      name: 'Ang',
      surname: 'Perez',
      email: 'ang@gmail.com',
      password: '1234',
      role: 'profesor',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    service = new UserService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* Create */
  it('should create an user', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    service.users = mockData;
    httpClientSpy.get.and.returnValue(of(mockData));
    service.getUsers();
    httpClientSpy.post.and.returnValue(of(uniqueData));
    service.register(uniqueData).subscribe({
      next: (user) => {
        expect(user).toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeTruthy();
      },
      complete: () => done(),
    });
  });

  /* Read */
  it('should return an user array', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(mockData));
    service.getUsers().subscribe({
      next: (users) => {
        expect(users).toEqual(mockData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should return an user array with admin identity', (done: DoneFn) => {
    service.identity = {
      id: '0',
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.get.and.returnValue(of(mockData));
    service.getUsers().subscribe({
      next: (users) => {
        expect(users).toEqual(mockData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should return an user', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.get.and.returnValue(of(uniqueData));
    service.getUser(uniqueData.id).subscribe({
      next: (user) => {
        expect(user).toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should return an user with admin identity', (done: DoneFn) => {
    service.identity = {
      id: '0',
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    const uniqueData: User = {
      id: 4,
      name: 'Pancho',
      surname: 'Lopez',
      email: 'pancho@gmail.com',
      password: '1234',
      role: 'user',
    };
    httpClientSpy.get.and.returnValue(of(uniqueData));
    service.getUser(uniqueData.id).subscribe({
      next: (user) => {
        expect(user).toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should not return an user for backend error', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.get.and.returnValue(of(new Error('Error.')));
    service.getUser(uniqueData.id).subscribe({
      next: (user) => {
        expect(user).not.toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should return an logged user', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.get.and.returnValue(of([uniqueData]));
    service.login(uniqueData.email, uniqueData.password).subscribe({
      next: (user) => {
        expect(user).toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should not return an logged user for erroneous password', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.get.and.returnValue(of([uniqueData]));
    service.login(uniqueData.email, 'not-password').subscribe({
      next: (user) => expect(user).not.toEqual(uniqueData),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should return an updated user', (done: DoneFn) => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    service.users = mockData;
    httpClientSpy.get.and.returnValue(of(mockData));
    service.getUsers();
    httpClientSpy.put.and.returnValue(of(uniqueData));
    service.updateUser(uniqueData, true).subscribe({
      next: (user) => {
        expect(user).toEqual(uniqueData);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should delete an user', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(of(null));
    service.deleteUser(0).subscribe({
      next: (message) => {
        expect(message).toEqual('User deleted.');
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });
});
