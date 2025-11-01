import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('insights')
@UseGuards(AuthGuard('jwt'))
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get(':conversationId')
  async getInsight(@Param('conversationId') conversationId: string) {
    return this.insightsService.getInsight(conversationId);
  }

  @Post(':conversationId')
  async generateInsight(@Param('conversationId') conversationId: string) {
    return this.insightsService.generateInsight(conversationId);
  }
}
