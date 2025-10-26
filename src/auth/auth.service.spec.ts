import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'test',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    createPartial: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a new user if email not taken', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPass');
      mockUsersService.createPartial.mockResolvedValueOnce({ ...mockUser, password: 'hashedPass' });

      const result = await service.register('test', 'new@example.com', 'plainPass');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUsersService.createPartial).toHaveBeenCalledWith(
        'test',
        'new@example.com',
        'hashedPass'
      );
      expect(result.email).toBe('test@example.com');
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      await expect(service.register(mockUser.name, mockUser.email, 'pass')).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password if password matches', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser(mockUser.email, 'password');
      expect(result.email).toBe(mockUser.email);
      expect(result.password).toBeUndefined();
    });

    it('should return null if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser(mockUser.email, 'wrong');
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      const result = await service.validateUser('nouser@example.com', 'any');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should sign and return a jwt token', async () => {
      const result = await service.login({ id: mockUser.id, email: mockUser.email });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
      expect(result.access_token).toBe('mockedToken');
    });
  });
});
