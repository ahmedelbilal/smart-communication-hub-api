import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>
  ) {}

  async create(conversation: Conversation, sender: User, content: string): Promise<Message> {
    const message = this.messagesRepo.create({ conversation, sender, content });
    const savedMessage = await this.messagesRepo.save(message);

    return this.messagesRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'conversation'],
      select: {
        id: true,
        content: true,
        sender: { id: true, name: true },
        conversation: { id: true },
        createdAt: true,
      },
    });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messagesRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
