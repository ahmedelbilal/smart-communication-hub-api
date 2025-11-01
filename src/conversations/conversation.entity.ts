import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.conversationsInitiated)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversationsReceived)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
