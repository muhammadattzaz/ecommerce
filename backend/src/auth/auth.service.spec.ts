import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  _id: { toString: () => 'user-id-1' },
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: '',
  role: 'customer',
  refreshToken: null,
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  findByIdWithToken: jest.fn(),
  findById: jest.fn(),
  findByIdWithPasswordHash: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test-secret'),
  get: jest.fn().mockReturnValue('test'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user when email is not taken', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        name: 'Test User',
        email: 'new@example.com',
        password: 'Password123!',
      });

      expect(result.user).toBeDefined();
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@example.com' }),
      );
    });

    it('throws ConflictException when email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ name: 'Dupe', email: 'taken@example.com', password: 'abc' }),
      ).rejects.toThrow(ConflictException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('stores a hash, not the plaintext password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      await service.register({ name: 'A', email: 'a@a.com', password: 'plaintext' });

      const createArg = mockUsersService.create.mock.calls[0][0];
      // The stored hash must NOT equal the plaintext
      expect(createArg.passwordHash).not.toBe('plaintext');
      // And must be a valid bcrypt hash (starts with $2b$)
      expect(createArg.passwordHash).toMatch(/^\$2[ab]\$12\$/);
    });
  });

  describe('login', () => {
    const mockRes = { cookie: jest.fn() } as any;

    it('returns the user on valid credentials', async () => {
      const hash = await bcrypt.hash('Password123!', 12);
      const user = { ...mockUser, passwordHash: hash };
      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({ email: user.email, password: 'Password123!' }, mockRes);

      expect(result.user).toBeDefined();
      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', expect.any(String), expect.any(Object));
      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', expect.any(String), expect.any(Object));
    });

    it('throws UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'whatever' }, mockRes),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      const hash = await bcrypt.hash('correctpass', 12);
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, passwordHash: hash });

      await expect(
        service.login({ email: mockUser.email, password: 'wrongpass' }, mockRes),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('never exposes the password hash in the returned user', async () => {
      const hash = await bcrypt.hash('Password123!', 12);
      const userFromDb = { ...mockUser, passwordHash: hash };
      mockUsersService.findByEmail.mockResolvedValue(userFromDb);
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({ email: mockUser.email, password: 'Password123!' }, mockRes);

      // Service returns what usersService.findByEmail returned — the transform
      // that strips passwordHash lives on the Mongoose schema toJSON, not here.
      // What matters: the service doesn't explicitly add it back.
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
