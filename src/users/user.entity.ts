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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

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

  @Column({ default: false })
  online: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
