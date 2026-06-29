import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: UserDocument }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });
    return { user };
  }

  async login(dto: LoginDto, res: Response): Promise<{ user: UserDocument }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens(user);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.updateRefreshToken(user._id.toString(), refreshHash);
    this.setTokenCookies(res, tokens);

    return { user };
  }

  async refresh(userId: string, refreshToken: string, res: Response): Promise<void> {
    const user = await this.usersService.findByIdWithToken(userId);
    if (!user?.refreshToken) throw new UnauthorizedException();

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: 900, // 15 minutes
      },
    );
    res.cookie('access_token', accessToken, this.cookieOptions(15 * 60 * 1000));
  }

  async logout(userId: string, res: Response): Promise<{ message: string }> {
    await this.usersService.updateRefreshToken(userId, null);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const updates: Record<string, string> = {};

    if (dto.name) updates.name = dto.name;
    if (dto.email) updates.email = dto.email.toLowerCase();

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('currentPassword is required to change your password');
      }
      const user = await this.usersService.findByIdWithPasswordHash(userId);
      if (!user) throw new UnauthorizedException();
      const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!valid) throw new BadRequestException('Current password is incorrect');
      updates.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    }

    const updated = await this.usersService.update(userId, updates);
    if (!updated) throw new UnauthorizedException();
    return updated;
  }

  private generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: 900, // 15 minutes
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: 604800, // 7 days
      }),
    };
  }

  private cookieOptions(maxAge: number) {
    return {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge,
    };
  }

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ): void {
    res.cookie('access_token', tokens.accessToken, this.cookieOptions(15 * 60 * 1000));
    res.cookie('refresh_token', tokens.refreshToken, this.cookieOptions(7 * 24 * 60 * 60 * 1000));
  }
}
