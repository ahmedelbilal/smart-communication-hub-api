import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Insight {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Conversation, (conversation) => conversation.insight, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;

  @ApiProperty()
  @Column({ type: 'text' })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
