import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';
import { Message } from 'src/messages/message.entity';
import { Insight } from 'src/insights/insight.entity';

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

  async getUserConversations(userId: string): Promise<{ id: string; user: User }[]> {
    const conversations = await this.conversationsRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      select: {
        id: true,
        user1: { id: true, name: true, online: true },
        user2: { id: true, name: true, online: true },
      },
      relations: ['user1', 'user2'],
      order: { messages: { createdAt: 'DESC' } },
    });

    //only send other user data
    return conversations.map((conversation) => ({
      id: conversation.id,
      user: userId === conversation.user1.id ? conversation.user2 : conversation.user1,
    }));
  }

  async findById(
    id: string,
    userId: string
  ): Promise<{ id: string; user: User; messages: Message[]; insight: Insight }> {
    const conversation = await this.conversationsRepo.findOne({
      where: [
        { id, user1: { id: userId } },
        { id, user2: { id: userId } },
      ],
      select: {
        id: true,
        user1: { id: true, name: true, online: true },
        user2: { id: true, name: true, online: true },
        messages: { id: true, content: true, createdAt: true, sender: { id: true, name: true } },
        insight: { id: true, summary: true },
      },
      relations: { user1: true, user2: true, messages: { sender: true }, insight: true },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    //only send other user data
    return {
      id: conversation.id,
      user: userId === conversation.user1.id ? conversation.user2 : conversation.user1,
      messages: conversation.messages,
      insight: conversation.insight,
    };
  }
}
