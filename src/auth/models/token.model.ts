import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenInfo {
  @Field()
  id: string;

  @Field()
  exp: string;
}

@ObjectType()
export class Token {
  @Field()
  accessToken: string;

  @Field(() => TokenInfo)
  accessTokenInfo: TokenInfo;

  @Field()
  refreshToken: string;

  @Field(() => TokenInfo)
  refreshTokenInfo: TokenInfo;
}
