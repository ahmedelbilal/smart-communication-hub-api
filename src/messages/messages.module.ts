import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatGateway } from './chat.gateway';
import { ConversationsModule } from '../conversations/conversations.module';
import { User } from '../users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), ConversationsModule, AuthModule],
  providers: [MessagesService, ChatGateway],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
