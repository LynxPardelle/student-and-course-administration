import { ActionReducerMap } from '@ngrx/store';
import { Sesion } from 'src/app/auth/interfaces/sesion';
import { SesionReducer } from './reducers/sesion.reducer';
export interface AppState {
  sesion: Sesion;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  sesion: SesionReducer,
};
