import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { UserEffects } from './user.effects';

/* RxJs */
import { Observable, of } from 'rxjs';

/* Models */
import { User } from '../models/user';

/* Store */
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UsersState } from '../interfaces/users.state';
import { LoadedUsersSelector, LoadingUsersSelector } from './user.selectors';

describe('UserEffects', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };
  let userStoreSpy: {
    select: jasmine.Spy;
    dispatch: jasmine.Spy;
  };

  let actions$: Observable<any>;
  let effects: UserEffects;
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
  let userStore: MockStore<UsersState>;
  const initialState = {
    users: { loading: false, users: mockData },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
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
    userStoreSpy = jasmine.createSpyObj('Store<UsersState>', [
      'select',
      'dispatch',
    ]);

    userStoreSpy.select.and.returnValue(of(mockData));
    userStoreSpy.dispatch.and.callThrough();
    effects = TestBed.inject(UserEffects);

    userStore = TestBed.inject(MockStore<UsersState>);
    userStore.setState({
      ...initialState,
      loading: false,
      users: mockData,
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
