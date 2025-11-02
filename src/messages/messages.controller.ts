import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetMessagesParamsDto } from './dto/get-messages-params.dto';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOkResponse({ type: [Message] })
  @Get(':conversationId')
  async getMessages(@Param() { conversationId }: GetMessagesParamsDto) {
    return this.messagesService.getMessages(conversationId);
  }
}
