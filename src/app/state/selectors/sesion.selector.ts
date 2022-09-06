import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Sesion } from 'src/app/auth/interfaces/sesion';
export const SesionSelector = (state: AppState) => state.sesion;
export const ActiveSesionSelector = createSelector(
  SesionSelector,
  (state: Sesion) => state.active
);

export const IdentitySesionSelector = createSelector(
  SesionSelector,
  (state: Sesion) => state.identity
);
