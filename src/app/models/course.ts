import CourseInterface from '../interfaces/course';
import { User } from '../models/user';

export class Course implements CourseInterface {
  constructor(
    public id: number,
    public title: string,
    public students: User[],
    public profesor: User | null
  ) {}
}
