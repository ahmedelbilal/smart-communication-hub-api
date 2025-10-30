import { Conversation } from 'src/conversations/conversation.entity';
import { Message } from 'src/messages/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
