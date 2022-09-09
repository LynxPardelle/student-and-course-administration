import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

/* RxJs */
import { of } from 'rxjs';

/* Models */
import { User } from 'src/app/user/models/user';

/* Services */
import { UserService } from './user.service';

/* Store */
import { Store } from '@ngrx/store';
import { UsersState } from '../interfaces/users.state';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  LoadedUsersSelector,
  LoadingUsersSelector,
} from '../state/user.selectors';
import {
  SesionLoadedSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';
import { AppState } from 'src/app/state/app.state';

describe('UserService', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };
  let storeSpy: {
    select: jasmine.Spy;
    dispatch: jasmine.Spy;
  };
  let userStoreSpy: {
    select: jasmine.Spy;
    dispatch: jasmine.Spy;
  };
  let service: UserService;
  const mockData: User[] = [
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
      id: 4,
      name: 'Pancho',
      surname: 'Lopez',
      email: 'pancho@gmail.com',
      password: '1234',
      role: 'user',
    },
    {
      id: 5,
      name: 'Ang',
      surname: 'Perez',
      email: 'ang@gmail.com',
      password: '1234',
      role: 'profesor',
    },
  ];
  let store: MockStore<AppState>;
  let userStore: MockStore<UsersState>;
  const initialState = {
    users: { loading: false, users: mockData },
    sesion: { active: false },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: LoadingUsersSelector,
              value: false,
            },
            {
              selector: LoadedUsersSelector,
              value: mockData,
            },
            {
              selector: SesionLoadedSelector,
              value: false,
            },
            {
              selector: IdentitySesionSelector,
              value: undefined,
            },
          ],
        }),
      ],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    storeSpy = jasmine.createSpyObj('Store<UsersState>', [
      'select',
      'dispatch',
    ]);
    userStoreSpy = jasmine.createSpyObj('Store<UsersState>', [
      'select',
      'dispatch',
    ]);

    storeSpy.select.and.returnValue(of(mockData[0]));
    userStoreSpy.select.and.returnValue(of(mockData));
    storeSpy.dispatch.and.callThrough();
    userStoreSpy.dispatch.and.callThrough();
    service = new UserService(
      httpClientSpy as any,
      storeSpy as any,
      userStoreSpy as any
    );

    store = TestBed.inject(MockStore<AppState>);
    userStore = TestBed.inject(MockStore<UsersState>);
    store.setState({
      ...initialState,
      sesion: { active: true, identity: mockData[0] },
    });
    userStore.setState({
      ...initialState,
      loading: false,
      users: mockData,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* Create */
  it('should create an user', async () => {
    const uniqueData: User = {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    };
    httpClientSpy.post.and.returnValue(of(uniqueData));
    let newUser = await service.register(uniqueData);
    expect(newUser).toEqual(uniqueData);
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
    service.access = 'admin';
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
    service.access = 'admin';
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

  /* FIXME:
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
  }); */

  it('should delete an user', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(of(null));
    service.deleteUser(0).subscribe({
      next: (message) => {
        expect(message).toEqual(null);
      },
      error: (err) => {
        expect(err).toBeFalsy();
        done();
      },
      complete: () => done(),
    });
  });
});
