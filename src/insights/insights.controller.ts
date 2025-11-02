import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Insight } from './insight.entity';
import { GetCreateInsightParamsDto } from './dto/get-create-insight-params.dto';

@ApiTags('Insights')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('insights')
@UseGuards(AuthGuard('jwt'))
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @ApiResponse({ status: 200, type: Insight })
  @Get(':conversationId')
  async getInsight(@Param() { conversationId }: GetCreateInsightParamsDto) {
    return this.insightsService.getInsight(conversationId);
  }

  @ApiResponse({ status: 201, type: Insight })
  @Post(':conversationId')
  async generateInsight(@Param() { conversationId }: GetCreateInsightParamsDto) {
    return this.insightsService.generateInsight(conversationId);
  }
}
