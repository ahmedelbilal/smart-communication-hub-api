import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetConversationParamsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
