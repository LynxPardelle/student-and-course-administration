import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ActiveSesionSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let store: MockStore;
  const initialState = { active: false };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [
        HttpClient,
        HttpHandler,
        provideMockStore({
          initialState,
          selectors: [
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
