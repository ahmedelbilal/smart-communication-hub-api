import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { Request } from 'express';
import { GetConversationParamsDto } from './dto/get-conversation-params.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getConversations(@Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.getUserConversations(user.id);
  }

  @Get(':id')
  async getConversationById(@Param() params: GetConversationParamsDto, @Req() req: Request) {
    const user = req.user as User;
    return this.conversationsService.findById(params.id, user.id);
  }
}
