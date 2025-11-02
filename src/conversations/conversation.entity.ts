import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Insight } from '../insights/insight.entity';
import { Message } from '../messages/message.entity';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Conversation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.conversationsInitiated)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversationsReceived)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @ApiProperty({ type: [Message] })
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ApiProperty({ type: Insight })
  @OneToOne(() => Insight, (insight) => insight.conversation)
  insight: Insight;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
