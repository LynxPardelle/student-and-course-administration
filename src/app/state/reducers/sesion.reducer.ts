import { createReducer, on } from '@ngrx/store';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import * as SesionActions from 'src/app/state/actions/sesion.actions';
const initialState: Sesion = {
  active: false,
};

export const SesionReducer = createReducer(
  initialState,
  on(SesionActions.LoadSesion, (s) => {
    return { ...s, active: false };
  }),
  on(SesionActions.SesionLoaded, (s, { sesion }) => {
    return { ...s, active: sesion.active, identity: sesion.identity };
  }),
  on(SesionActions.CloseSesion, (s) => {
    localStorage.removeItem('identitySACA');
    return { ...s, active: false };
  }),
  on(SesionActions.ErrorSesion, (s) => {
    localStorage.removeItem('identitySACA');
    return { ...s, active: false };
  })
);
