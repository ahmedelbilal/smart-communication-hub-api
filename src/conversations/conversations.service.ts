import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepo: Repository<Conversation>
  ) {}

  async findOrCreate(user1: User, user2: Pick<User, 'id'>): Promise<Conversation> {
    let conversation = await this.conversationsRepo.findOne({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id } },
        { user1: { id: user2.id }, user2: { id: user1.id } },
      ],
    });

    if (!conversation) {
      conversation = this.conversationsRepo.create({ user1, user2 });
      await this.conversationsRepo.save(conversation);
    }

    return conversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationsRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2', 'messages'],
      order: { createdAt: 'DESC' },
    });
  }
}
