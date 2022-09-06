import { User } from 'src/app/user/models/user';
export interface UsersState {
  loading: boolean;
  users: User[];
}
