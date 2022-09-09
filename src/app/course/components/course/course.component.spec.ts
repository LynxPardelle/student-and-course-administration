import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CourseComponent } from './course.component';

/* Store */
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  LoadedCoursesSelector,
  LoadingCoursesSelector,
} from '../../state/course.selectors';

describe('CourseComponent', () => {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;

  let store: MockStore;
  const initialState = { loading: false, courses: [] };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, ReactiveFormsModule],
      declarations: [CourseComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: LoadingCoursesSelector,
              value: false,
            },
            {
              selector: LoadedCoursesSelector,
              value: [],
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
