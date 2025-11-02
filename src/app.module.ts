import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import configs from './core/config';
import { validate } from './core/config/env.validation';
import databaseConfig from './core/config/database.config';
import { CoreModule } from './core/core.module';
import { InsightsModule } from './insights/insights.module';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

import { Conversation } from './conversations/conversation.entity';
import { Insight } from './insights/insight.entity';
import { Message } from './messages/message.entity';
import { User } from './users/user.entity';
import throttlerConfig from './core/config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      validate,
    }),
    CoreModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: dbConfig.type,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.name,
        entities: [User, Message, Conversation, Insight],
        synchronize: dbConfig.synchronize,
        ssl: dbConfig.ssl,
      }),
    }),

    ThrottlerModule.forRootAsync({
      inject: [throttlerConfig.KEY],
      useFactory: (rateConfig: ConfigType<typeof throttlerConfig>) => [
        {
          ttl: rateConfig.ttl,
          limit: rateConfig.limit,
        },
      ],
    }),

    AuthModule,
    UsersModule,
    MessagesModule,
    ConversationsModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
