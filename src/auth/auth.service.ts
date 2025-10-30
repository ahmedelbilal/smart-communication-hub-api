import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private getSaltRounds(): number {
    return Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const saltRounds = this.getSaltRounds();
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.createPartial(name, email, hashed);
    delete user.password;
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    delete user.password;
    return user;
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
