import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtDto, JwtInput } from './dto/jwt.dto';
import { LoginInput } from './dto/login.input';
import { Login } from './models/auth.model';
import { Token, TokenInfo } from './models/token.model';
import { SecurityConfig } from 'src/config/config.interface';
import { User } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => DBService))
    private readonly db: DBService,
    @Inject(forwardRef(() => PasswordService))
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  async login(payload: LoginInput): Promise<Login> {
    const user = this.db.findWithEmail(payload.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isPasswordValid = await this.passwordService.validatePassword(payload?.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException();
    }

    return {
      ...this.generateToken({
        id: user.id,
      }),
      user,
    };
  }

  generateToken(payload: JwtInput): Token {
    const accessToken = this.jwtService.sign(payload);
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig.refreshIn,
    });
    const accessTokenInfo = this.jwtService.decode(accessToken) as TokenInfo;
    const refreshTokenInfo = this.jwtService.decode(refreshToken) as TokenInfo;

    return {
      accessToken,
      refreshToken,
      accessTokenInfo,
      refreshTokenInfo,
    };
  }

  async validateUser(payload: JwtDto): Promise<User> {
    const user = this.db.findWithId(payload.id);
    if (!user) {
      throw new NotFoundException();
    }
    return { ...user };
  }
}
