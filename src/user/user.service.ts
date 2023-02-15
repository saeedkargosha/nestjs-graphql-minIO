import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => DBService))
    private readonly db: DBService,
  ) {}

  async getUser(email: string): Promise<User> {
    return this.db.findWithEmail(email);
  }
}
