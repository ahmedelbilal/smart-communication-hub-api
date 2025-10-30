import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = { id: '1', name: 'test', email: 'test@example.com', password: 'hashed' } as User;

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createPartial', () => {
    it('should create and save a new user', async () => {
      const result = await service.createPartial(mockUser.name, mockUser.email, mockUser.password);
      expect(repo.create).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.findByEmail(mockUser.email);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findByEmail('nope@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.findById('1');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { id: true, name: true, email: true },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
