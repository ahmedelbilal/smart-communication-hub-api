import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { Conversation } from './conversation.entity';
import { ConversationsService } from './conversations.service';
import { GetConversationParamsDto } from './dto/get-conversation-params.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @ApiOkResponse({ type: [Conversation] })
  @Get()
  async getConversations(@Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.getUserConversations(user.id);
  }

  @ApiOkResponse({ type: Conversation })
  @ApiNotFoundResponse({ description: 'Conversation Notfound' })
  @Get(':id')
  async getConversationById(@Param() params: GetConversationParamsDto, @Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.findById(params.id, user.id);
  }
}
