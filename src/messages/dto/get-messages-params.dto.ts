import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetMessagesParamsDto {
  @ApiProperty()
  @IsUUID()
  conversationId: string;
}
