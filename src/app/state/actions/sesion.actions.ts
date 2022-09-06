import { createAction, props } from '@ngrx/store';
import { Sesion } from 'src/app/auth/interfaces/sesion';

export const InactiveSesion = createAction('[Sesion] Load Sesion');
export const ActiveSesion = createAction(
  '[Sesion] Sesion Loaded',
  props<{ sesion: Sesion }>()
);
