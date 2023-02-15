import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { Token } from './token.model';
import { User } from '../../user/models/user.model';

@ObjectType()
export class Login extends PartialType(Token) {
  @Field(() => User)
  user: User;
}
