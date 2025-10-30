import { IsUUID } from 'class-validator';

export class GetConversationParamsDto {
  @IsUUID()
  id: string;
}
