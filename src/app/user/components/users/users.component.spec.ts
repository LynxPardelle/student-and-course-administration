import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  LoadedUsersSelector,
  LoadingUsersSelector,
} from 'src/app/state/selectors/user.selector';
import { UserService } from 'src/app/user/services/user.service';
import { User } from '../../models/user';
import { of } from 'rxjs';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { By } from '@angular/platform-browser';
import {
  ActiveSesionSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let service: UserService;
  let fixture: ComponentFixture<UsersComponent>;
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

  let form: FormGroup;
  let idForm: any;
  let nameForm: any;
  let surnameForm: any;
  let emailForm: any;
  let passwordForm: any;
  let roleForm: any;

  let store: MockStore;
  const initialState = {
    users: { loading: false, users: [] },
    sesion: { active: false },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: LoginComponent },
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [UsersComponent],
      providers: [
        BsModalService,
        BsModalRef,
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
              selector: ActiveSesionSelector,
              value: false,
            },
            {
              selector: IdentitySesionSelector,
              value: undefined,
            },
          ],
        }),
        UserService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(UserService);
    spyOn(service, 'getUsers').and.returnValue(of(mockData));
    form = component.editUserForm;
    idForm = form.controls['id'];
    nameForm = form.controls['name'];
    surnameForm = form.controls['surname'];
    emailForm = form.controls['email'];
    passwordForm = form.controls['password'];
    roleForm = form.controls['role'];

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should get identity and set access token', fakeAsync(() => {
    store.setState({
      sesion: { active: true, identity: mockData[0] },
    });
    store.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    tick(1000);
    expect(component.access).toEqual(mockData[0].role);
  }));

  it('should get Users', () => {
    const table = fixture.debugElement.query(By.css('[mat-table]'));
    expect(table).toBeTruthy();
    service.updateUsersList();
    expect(component.ELEMENT_DATA).toEqual(mockData);
    expect(table).toBeTruthy();
  });

  it('form should be invalid until all the controls have a value', () => {
    idForm.setValue(0);
    expect(form.invalid).toBeTrue();
    nameForm.setValue('AAA');
    expect(nameForm.valid).toBeTrue();
    expect(form.invalid).toBeTrue();
    surnameForm.setValue('AAA');
    expect(surnameForm.valid).toBeTrue();
    expect(form.invalid).toBeTrue();
    emailForm.setValue('AAA');
    expect(emailForm.invalid).toBeTrue();
    expect(form.invalid).toBeTrue();
    emailForm.setValue('AAA@aaa.aaa');
    expect(emailForm.valid).toBeTrue();
    expect(emailForm.valid).toBeTrue();
    expect(form.invalid).toBeTrue();
    passwordForm.setValue('AAA');
    expect(passwordForm.invalid).toBeTrue();
    passwordForm.setValue(
      '59l4lfRPT!Y4CFguysCG#evyfc%3qWq9yRZGQKC#7VQvUip5bD59l4lfRPT!Y4CFguysCG#evyfc%3qWq9yRZGQKC#7VQvUip5bD'
    );
    expect(passwordForm.invalid).toBeTrue();
    passwordForm.setValue('AAAA');
    expect(passwordForm.valid).toBeTrue();
    expect(form.valid).toBeTrue();
  });

  it('should edit an user', async () => {
    idForm.setValue(0);
    nameForm.setValue('AAA');
    surnameForm.setValue('AAA');
    emailForm.setValue('AAA@aaa.aaa');
    passwordForm.setValue('AAAA');
    spyOn(service, 'updateUser').and.returnValue(of(mockData[0]));
    await component.edit();
    expect(idForm.getRawValue()).toEqual('');
    expect(nameForm.getRawValue()).toEqual('');
    expect(surnameForm.getRawValue()).toEqual('');
    expect(emailForm.getRawValue()).toEqual('');
    expect(passwordForm.getRawValue()).toEqual('');
    expect(roleForm.getRawValue()).toEqual('');
  });

  it('should not edit an user', () => {
    idForm.setValue(0);
    nameForm.setValue('AAA');
    surnameForm.setValue('AAA');
    emailForm.setValue('AAA@aaa.aaa');
    passwordForm.setValue('AAAA');
    component.edit();
    expect(idForm.getRawValue()).toEqual(0);
    expect(nameForm.getRawValue()).toEqual('AAA');
    expect(surnameForm.getRawValue()).toEqual('AAA');
    expect(emailForm.getRawValue()).toEqual('AAA@aaa.aaa');
    expect(passwordForm.getRawValue()).toEqual('AAAA');
    expect(roleForm.getRawValue()).toEqual('user');
  });

  it('should delete an user', (done: DoneFn) => {
    spyOn(service, 'deleteUser').and.returnValue(of('deleted'));
    component.delete(mockData[0]);
    expect().nothing();
    done();
  });

  it('should not delete an user', (done: DoneFn) => {
    component.delete(mockData[0]);
    expect().nothing();
    done();
  });

  it('should edit form values', () => {
    const user: User = {
      id: 0,
      name: 'name',
      surname: 'surname',
      email: 'ema@il.com',
      password: '',
      role: 'user',
    };
    spyOn(service, 'getUser').and.returnValue(of(user));
    component.setUserEdit(user);
    expect(idForm.getRawValue()).toEqual(user.id);
    expect(nameForm.getRawValue()).toEqual(user.name);
    expect(surnameForm.getRawValue()).toEqual(user.surname);
    expect(emailForm.getRawValue()).toEqual(user.email);
    expect(passwordForm.getRawValue()).toEqual(user.password);
    expect(roleForm.getRawValue()).toEqual(user.role);
  });

  xit('should filter', () => {
    component.ngOnInit();
    const matInput = fixture.debugElement.query(By.css('[matInput]'));
    console.log(matInput);
    expect(matInput).toBeTruthy();
    let handler: Function | undefined;

    matInput.nativeElement.addListener = (
      eventName: string,
      eventHandler: Function
    ) => {
      if (eventName === 'keyup') {
        handler = eventHandler;
      }
    };
    matInput.nativeElement.removeListener = () => {};

    if (handler) {
      handler('a');
    }
    expect(component.dataSource.filter).toEqual('a');
  });

  it('should clearForm', () => {
    idForm.setValue(0);
    nameForm.setValue('AAA');
    surnameForm.setValue('AAA');
    emailForm.setValue('AAA@aaa.aaa');
    passwordForm.setValue('AAA');
    roleForm.setValue('AAA');
    component.clearForm();
    expect(idForm.getRawValue()).toEqual('');
    expect(nameForm.getRawValue()).toEqual('');
    expect(surnameForm.getRawValue()).toEqual('');
    expect(emailForm.getRawValue()).toEqual('');
    expect(passwordForm.getRawValue()).toEqual('');
    expect(roleForm.getRawValue()).toEqual('');
  });
});
