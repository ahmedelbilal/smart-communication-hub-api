import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { Request } from 'express';
import { GetConversationParamsDto } from './dto/get-conversation-params.dto';
import { Conversation } from './conversation.entity';

@ApiTags('Conversations')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @ApiResponse({ status: 200, type: [Conversation] })
  @Get()
  async getConversations(@Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.getUserConversations(user.id);
  }

  @ApiResponse({ status: 200, type: Conversation })
  @ApiNotFoundResponse({ description: 'Conversation Notfound' })
  @Get(':id')
  async getConversationById(@Param() params: GetConversationParamsDto, @Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.findById(params.id, user.id);
  }
}
