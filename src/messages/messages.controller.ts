import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from './message.entity';
import { GetMessagesParamsDto } from './dto/get-messages-params.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiResponse({ status: 200, type: [Message] })
  @Get(':conversationId')
  async getMessages(@Param() { conversationId }: GetMessagesParamsDto) {
    return this.messagesService.getMessages(conversationId);
  }
}
