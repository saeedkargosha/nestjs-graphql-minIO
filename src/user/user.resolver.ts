import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async user(@Args('email') email: string): Promise<User> {
    const result = await this.userService.getUser(email.toLowerCase());
    return result;
  }
}
