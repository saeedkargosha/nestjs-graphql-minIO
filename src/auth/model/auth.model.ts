import { ObjectType, PartialType } from '@nestjs/graphql';
import { Token } from './token.model';

@ObjectType()
export class Login extends PartialType(Token) {}
