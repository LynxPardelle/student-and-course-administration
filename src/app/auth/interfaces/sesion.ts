import { User } from 'src/app/user/models/user';

export interface Sesion {
  active: boolean;
  user?: User;
}
