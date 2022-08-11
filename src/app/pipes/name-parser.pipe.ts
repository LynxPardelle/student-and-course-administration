import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
@Pipe({
  name: 'nameParser',
})
export class NameParserPipe implements PipeTransform {
  transform(value: User, ...args: any[]): string {
    console.log(value);
    return `${this.capitalizeFirstLetter(
      value.name
    )} ${this.capitalizeFirstLetter(value.surname)}`;
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
