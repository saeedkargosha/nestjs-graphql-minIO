import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { Login } from './models/auth.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Login)
  async login(@Args('data') data: LoginInput): Promise<Login> {
    const result = await this.auth.login({ ...data, email: data.email.toLowerCase() });

    return result;
  }
}
