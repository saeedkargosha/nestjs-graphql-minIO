import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/config/config.interface';

export class PasswordService {
  constructor(private configService: ConfigService) {}

  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;
    return Number.isInteger(Number(saltOrRounds)) ? Number(saltOrRounds) : saltOrRounds;
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPAssword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
