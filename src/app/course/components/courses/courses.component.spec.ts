import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesComponent } from './courses.component';
import { cold } from 'jasmine-marbles';

/* RxJs */
import { firstValueFrom, of } from 'rxjs';

/* Store */
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  LoadingCoursesSelector,
  LoadedCoursesSelector,
} from '../../state/course.selectors';

/* NGX-Bootstrap */
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
    LoadingCoursesSelector.setResult(true);
    const expected = cold('(a|)', { a: { loading: true, courses: [] } });
    let loading = await firstValueFrom(store.select(LoadingCoursesSelector));
    let courses = await firstValueFrom(store.select(LoadedCoursesSelector));
    expect(of({ loading: loading, courses: courses })).toBeObservable(expected);
  });
});
