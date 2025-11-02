import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetCreateInsightParamsDto } from './dto/get-create-insight-params.dto';
import { Insight } from './insight.entity';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('insights')
@UseGuards(AuthGuard('jwt'))
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @ApiOkResponse({ type: Insight })
  @Get(':conversationId')
  async getInsight(@Param() { conversationId }: GetCreateInsightParamsDto) {
    return this.insightsService.getInsight(conversationId);
  }

  @ApiOkResponse({ type: Insight })
  @HttpCode(HttpStatus.OK)
  @Post(':conversationId')
  async generateInsight(@Param() { conversationId }: GetCreateInsightParamsDto) {
    return this.insightsService.generateInsight(conversationId);
  }
}
