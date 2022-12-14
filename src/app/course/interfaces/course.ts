import { User } from 'src/app/user/models/user';

export default interface courseInterface {
  id: number;
  title: string;
  students: User[];
  profesor: User | null;
}
