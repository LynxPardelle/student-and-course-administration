import { createReducer, on } from '@ngrx/store';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import { InactiveSesion, ActiveSesion } from 'src/app/state/actions/sesion.actions';
const initialState: Sesion = {
  active: false,
};

export const SesionReducer = createReducer(
  initialState,
  on(InactiveSesion, (s) => {
    return { ...s, active: false };
  }),
  on(ActiveSesion, (s, { sesion }) => {
    return { ...s, active: sesion.active, identity: sesion.identity };
  })
);
