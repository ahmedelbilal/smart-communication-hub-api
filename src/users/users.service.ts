import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  createPartial(name: string, email: string, hashedPassword: string) {
    const user = this.usersRepository.create({ name, email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }

  async findAll(id: string, searchTerm?: string) {
    const qb = this.usersRepository.createQueryBuilder('user');

    qb.select(['user.id', 'user.name']);

    // Exclude current user
    qb.where('user.id != :id', { id });

    // Optional search filter
    if (searchTerm) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${searchTerm}%`,
      });
    }

    // Exclude users who already have a conversation with this user
    qb.andWhere(
      `
    user.id NOT IN (
      SELECT 
        CASE
          WHEN c.user1_Id = :id THEN c.user2_Id
          ELSE c.user1_Id
        END
      FROM conversation c
      WHERE c.user1_Id = :id OR c.user2_Id = :id
    )
  `,
      { id }
    );

    return await qb.getMany();
  }

  async updateUserById(id: string, updatedData: Partial<User>) {
    return this.usersRepository.update({ id }, updatedData);
  }

  //only return users who i have a conversation with
  async getOnlineUsers(userId: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.conversationsInitiated', 'initiated', 'initiated.user2 = :userId', { userId })
      .leftJoin('user.conversationsReceived', 'received', 'received.user1 = :userId', { userId })
      .where('user.id != :userId', { userId })
      .andWhere('user.online = true')
      .andWhere('(initiated.id IS NOT NULL OR received.id IS NOT NULL)')
      .select(['user.id', 'user.name'])
      .getMany();
  }
}
