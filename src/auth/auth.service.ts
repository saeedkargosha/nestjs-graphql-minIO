import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtDto, JwtInput } from './dto/jwt.dto';
import { LoginInput } from './dto/login.input';
import { Login } from './models/auth.model';
import { Token, TokenInfo } from './models/token.model';
import { SecurityConfig } from 'src/config/config.interface';
import { User } from 'src/user/models/user.model';
import { SignupInput } from './dto/signup.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PasswordService))
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  async login(payload: LoginInput): Promise<Login> {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

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

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(payload.password);

    const user = await this.prisma.user.create({
      data: {
        email: payload?.email,
        firstname: payload?.firstname,
        lastname: payload?.lastname,
        password: hashedPassword,
      },
    });

    return this.generateToken({
      id: user.id,
    });
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
    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw new NotFoundException();
    }
    return { ...user };
  }
}
