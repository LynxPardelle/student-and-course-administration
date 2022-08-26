import UserInterface from 'src/app/user/interfaces/user';

export class User implements UserInterface {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public email: string,
    public password: string,
    public role: string
  ) {}
}
