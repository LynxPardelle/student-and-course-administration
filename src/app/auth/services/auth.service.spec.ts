import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ActiveSesionSelector,
  IdentitySesionSelector,
} from 'src/app/state/selectors/sesion.selector';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

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
    service = TestBed.inject(AuthService);

    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
