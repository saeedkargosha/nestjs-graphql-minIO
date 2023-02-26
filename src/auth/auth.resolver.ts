import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { Auth, Login } from './models/auth.model';
import { Token } from './models/token.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput): Promise<Token> {
    const { accessToken, refreshToken, accessTokenInfo, refreshTokenInfo } = await this.auth.createUser({
      ...data,
      email: data.email.toLowerCase(),
    });

    return {
      accessToken,
      refreshToken,
      accessTokenInfo,
      refreshTokenInfo,
    };
  }

  @Mutation(() => Login)
  async login(@Args('data') data: LoginInput): Promise<Login> {
    const result = await this.auth.login({ ...data, email: data.email.toLowerCase() });

    return result;
  }
}
