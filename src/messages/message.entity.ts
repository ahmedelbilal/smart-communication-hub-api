import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
