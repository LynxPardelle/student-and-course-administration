import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { Course } from 'src/app/course/models/course';
import { CourseService } from 'src/app/course/services/course.service';
import { NameParserPipe } from 'src/app/shared/pipes/name-parser.pipe';
import {
  ActiveSesionSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';
import {
  LoadedUsersSelector,
  LoadingUsersSelector,
} from 'src/app/state/selectors/user.selector';
import { User } from 'src/app/user/models/user';
import { UserService } from 'src/app/user/services/user.service';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let userService: UserService;
  let courseService: CourseService;
  let fixture: ComponentFixture<UserComponent>;
  //let route: ;
  const mockDataUsers: User[] = [
    {
      id: 0,
      name: 'admin',
      surname: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    },
    {
      name: 'Kiera',
      surname: 'Rau',
      email: 'Katrina70@hotmail.com',
      password: '4AfK_uuOiSDWagY',
      role: 'user',
      id: 1,
    },
    {
      id: 6,
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
  const mockDataCourses: Course[] = [
    {
      title: 'Angular',
      students: [
        {
          name: 'Kiera',
          surname: 'Rau',
          email: 'Katrina70@hotmail.com',
          password: '4AfK_uuOiSDWagY',
          role: 'user',
          id: 1,
        },
        {
          name: 'Gordon',
          surname: 'Wiegand',
          email: 'Tod40@hotmail.com',
          password: 'JTzzgUiW8utiU28',
          role: 'admin',
          id: 2,
        },
        {
          name: 'Petra',
          surname: 'Considine',
          email: 'Delpha13@yahoo.com',
          password: '7mCykyanxtC6Yny',
          role: 'profesor',
          id: 3,
        },
      ],
      profesor: {
        name: 'Mellie',
        surname: 'Sanford',
        email: 'Marvin_Walsh48@hotmail.com',
        password: 'wE9_7Qy4IdB6uDy',
        role: 'profesor',
        id: 5,
      },
      id: 1,
    },
    {
      title: 'Node js',
      students: [],
      profesor: {
        name: 'Petra',
        surname: 'Considine',
        email: 'Delpha13@yahoo.com',
        password: '7mCykyanxtC6Yny',
        role: 'profesor',
        id: 3,
      },
      id: 2,
    },
    {
      title: 'NGINX',
      students: [],
      profesor: {
        name: 'Petra',
        surname: 'Considine',
        email: 'Delpha13@yahoo.com',
        password: '7mCykyanxtC6Yny',
        role: 'profesor',
        id: 3,
      },
      id: 3,
    },
    {
      title: 'Javascript',
      students: [],
      profesor: {
        name: 'Mellie',
        surname: 'Sanford',
        email: 'Marvin_Walsh48@hotmail.com',
        password: 'wE9_7Qy4IdB6uDy',
        role: 'profesor',
        id: 5,
      },
      id: 6,
    },
    {
      title: 'Html & CSS',
      students: [],
      profesor: {
        name: 'Petra',
        surname: 'Considine',
        email: 'Delpha13@yahoo.com',
        password: '7mCykyanxtC6Yny',
        role: 'profesor',
        id: 3,
      },
      id: 7,
    },
    {
      title: 'Python',
      students: [],
      profesor: {
        name: 'Petra',
        surname: 'Considine',
        email: 'Delpha13@yahoo.com',
        password: '7mCykyanxtC6Yny',
        role: 'profesor',
        id: 3,
      },
      id: 8,
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
      declarations: [UserComponent, NameParserPipe],
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
              value: mockDataUsers,
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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '0' }),
          },
        },
        UserService,
        CourseService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    courseService = fixture.debugElement.injector.get(CourseService);
    spyOn(userService, 'getUser').and.returnValue(of(mockDataUsers[0]));
    spyOn(courseService, 'getCourses').and.returnValue(of(mockDataCourses));
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

  it('should clear clearForm', () => {
    component.setUserForm(true);
    expect(idForm.getRawValue()).toEqual(-1);
    expect(nameForm.getRawValue()).toEqual('');
    expect(surnameForm.getRawValue()).toEqual('');
    expect(emailForm.getRawValue()).toEqual('');
    expect(passwordForm.getRawValue()).toEqual('');
    expect(roleForm.getRawValue()).toEqual('');
  });

  it('should update user', () => {
    idForm.setValue(0);
    nameForm.setValue('AAA');
    surnameForm.setValue('AAA');
    emailForm.setValue('AAA@aaa.aaa');
    passwordForm.setValue('AAA');
    roleForm.setValue('AAA');
    spyOn(userService, 'updateUser').and.returnValue(of(mockDataUsers[0]));
    component.submit();
    expect(idForm.getRawValue()).toEqual(mockDataUsers[0].id);
    expect(nameForm.getRawValue()).toEqual(mockDataUsers[0].name);
    expect(surnameForm.getRawValue()).toEqual(mockDataUsers[0].surname);
    expect(emailForm.getRawValue()).toEqual(mockDataUsers[0].email);
    expect(passwordForm.getRawValue()).toEqual(mockDataUsers[0].password);
    expect(roleForm.getRawValue()).toEqual(mockDataUsers[0].role);
  });

  it('should add student role', () => {
    spyOn(courseService, 'updateCourse').and.returnValue(
      of(mockDataCourses[0])
    );
    component.addStudent(mockDataCourses[0]);
    expect(mockDataCourses[0].students.includes(mockDataUsers[0])).toBeTrue();
  });

  it('should remove student role', () => {
    spyOn(courseService, 'updateCourse').and.returnValue(
      of(mockDataCourses[0])
    );
    component.removeStudent(mockDataCourses[0]);
    expect(mockDataCourses[0].students.includes(mockDataUsers[0])).toBeFalse();
  });

  it('should change edit option', () => {
    component.isEdit = false;
    component.access = 'admin';
    component.changeEditOption();
    expect(component.isEdit).toBeTrue();
    component.access = 'profesor';
    component.changeEditOption();
    expect(component.isEdit).toBeFalse();
    component.access = 'public';
    component.changeEditOption();
    expect(component.isEdit).toBeFalse();
  });
});
