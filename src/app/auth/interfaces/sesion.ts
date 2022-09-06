import { User } from 'src/app/user/models/user';

export interface Sesion {
  active: boolean;
  identity?: User;
}
