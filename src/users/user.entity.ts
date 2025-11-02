import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { Message } from '../messages/message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ description: 'Only returned in user profile.' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  conversationsInitiated: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.user2)
  conversationsReceived: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @ApiProperty({
    description: 'Online status, returned only for users in your conversations.',
  })
  @Column({ default: false })
  online: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
