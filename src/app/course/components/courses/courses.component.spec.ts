import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CoursesComponent } from './courses.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import {
  loadingCoursesSelector,
  loadedCoursesSelector,
} from 'src/app/state/selectors/course.selector';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  let store: MockStore;
  const initialState = { loading: false, courses: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        // StoreModule.forRoot(ROOT_REDUCERS),
      ],
      declarations: [CoursesComponent],
      providers: [
        BsModalService,
        BsModalRef,
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: loadingCoursesSelector,
              value: false,
            },
            {
              selector: loadedCoursesSelector,
              value: [],
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be cold', async () => {
    store.setState({ loading: true, courses: [] });
    loadingCoursesSelector.setResult(true);
    const expected = cold('(a|)', { a: { loading: true, courses: [] } });
    let loading = await firstValueFrom(store.select(loadingCoursesSelector));
    let courses = await firstValueFrom(store.select(loadedCoursesSelector));
    expect(of({ loading: loading, courses: courses })).toBeObservable(expected);
  });
});
