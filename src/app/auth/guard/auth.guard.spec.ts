import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthGuard } from './auth.guard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ActiveSesionSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let store: MockStore;
  const initialState = { active: false };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
    });
    guard = TestBed.inject(AuthGuard);

    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
