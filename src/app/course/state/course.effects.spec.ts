import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CourseEffects } from './course.effects';

/* RxJs */
import { Observable, of } from 'rxjs';

/* Models */
import { Course } from '../models/course';

/* Services */
import { CourseService } from '../services/course.service';

/* Store */
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CoursesState } from '../interfaces/courses.state';
import {
  LoadedCoursesSelector,
  LoadingCoursesSelector,
} from './course.selectors';

describe('CourseEffects', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };
  let courseStoreSpy: {
    select: jasmine.Spy;
    dispatch: jasmine.Spy;
  };
  let actions$: Observable<any>;
  let effects: CourseEffects;
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
        {
          id: 0,
          name: 'admin',
          surname: 'admin',
          email: 'admin@example.com',
          password: 'password',
          role: 'admin',
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

  let courseStore: MockStore<CoursesState>;
  const initialState = {
    courses: { loading: false, courses: [] },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CourseEffects,
        provideMockActions(() => actions$),
        CourseService,
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: LoadingCoursesSelector,
              value: false,
            },
            {
              selector: LoadedCoursesSelector,
              value: mockDataCourses,
            },
          ],
        }),
      ],
    });
    courseStoreSpy = jasmine.createSpyObj('Store<CoursesState>', [
      'select',
      'dispatch',
    ]);
    courseStoreSpy.select.and.returnValue(of(mockDataCourses));
    courseStoreSpy.dispatch.and.callThrough();

    effects = TestBed.inject(CourseEffects);

    courseStore = TestBed.inject(MockStore<CoursesState>);
    courseStore.setState({
      ...initialState,
      loading: false,
      courses: mockDataCourses,
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
