import { Pipe, PipeTransform } from '@angular/core';
import { User } from './types';

@Pipe({
  name: 'getUserByEmail',
  standalone: true,
})
export class GetUserByEmailPipe implements PipeTransform {
  transform(email: string, users: User[]): User | undefined {
    return users.find((user) => user.email === email);
  }
}
