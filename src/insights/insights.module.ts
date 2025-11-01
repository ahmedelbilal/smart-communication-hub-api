import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insight } from './insight.entity';
import { Conversation } from '../conversations/conversation.entity';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Insight, Conversation])],
  providers: [InsightsService],
  controllers: [InsightsController],
  exports: [InsightsService],
})
export class InsightsModule {}
