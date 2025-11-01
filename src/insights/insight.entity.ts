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

@Entity()
export class Insight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Conversation, (conversation) => conversation.insight, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;

  @Column({ type: 'text' })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
