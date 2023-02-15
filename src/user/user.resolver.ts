import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gqlAuth.guard';
import { User } from 'src/user/models/user.model';
import { UserEntity } from 'src/decorators/user.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@UserEntity() user: User): Promise<User> {
    const result = await this.userService.getUser(user.email.toLowerCase());
    return result;
  }
}
