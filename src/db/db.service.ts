import { Injectable } from '@nestjs/common';
import { User } from 'src/user/models/user.model';

@Injectable()
export class DBService {
  private users: Array<User> = [
    {
      id: '1',
      email: 'saeedkargosha@gmail.com',
      firstname: 'Saeed',
      lastname: 'Kargosha',
      password: '1234567890',
    },
  ];

  findWithEmail(email: string): User {
    return this.users.find((user) => user.email === email);
  }

  findWithId(id: string): User {
    return this.users.find((user) => user.id === id);
  }
}
