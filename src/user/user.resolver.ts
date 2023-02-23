import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gqlAuth.guard';
import { User } from './models/user.model';
import { UserEntity } from 'src/decorators/user.decorator';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/Upload.js';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@UserEntity() user: User): Promise<User> {
    const result = await this.userService.getUser(user.email.toLowerCase());
    return result;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async uploadAvatar(@UserEntity() user: User, @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
    return this.userService.uplaodAvatar(user, file);
  }
}
