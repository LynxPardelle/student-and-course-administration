import CourseInterface from 'src/app/course/interfaces/course';
import { User } from 'src/app/user/models/user';

export class Course implements CourseInterface {
  constructor(
    public id: number,
    public title: string,
    public students: User[],
    public profesor: User | null
  ) {}
}
