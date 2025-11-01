import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { Message } from './messages/message.entity';
import { Conversation } from './conversations/conversation.entity';
import { InsightsModule } from './insights/insights.module';
import { Insight } from './insights/insight.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      entities: [User, Message, Conversation, Insight],
      synchronize: process.env.NODE_ENV === 'development',
      ssl: process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT } : false,
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    ConversationsModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
