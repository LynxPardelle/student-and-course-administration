import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

/* Store */
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  SesionLoadedSelector,
  IdentitySesionSelector,
} from './state/selectors/sesion.selector';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let store: MockStore;
  const initialState = { active: false };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
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
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Student and Course Administration'`, () => {
    expect(component.title).toEqual('Student and Course Administration');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain(
      'Student and Course Administration'
    );
  });

  /* it('should put identity as null on logOut', async () => {
    component.identity = 'something';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('#logOutBTN'));
    expect(btn).toBeTruthy();
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.identity).toEqual(null);
  }); */
});
