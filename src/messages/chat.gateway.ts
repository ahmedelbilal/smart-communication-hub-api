import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // userId -> socketsIds
  private onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('Missing token');

      const payload = await this.authService.verifyToken(token);
      const userId = payload.sub || payload.id;

      const userSockets = this.onlineUsers.get(userId) || new Set();
      userSockets.add(client.id);

      this.onlineUsers.set(userId, userSockets);
      client.data.user = { id: userId };

      await this.usersService.updateUserById(userId, { online: true });
      (await this.usersService.getOnlineUsers(userId)).forEach(({ id }) => {
        if (this.onlineUsers.has(id))
          this.server.to(Array.from(this.onlineUsers.get(id))).emit('user_joined', { id: userId });
      });

      this.logger.log(`User ${userId} connected`);
    } catch (error) {
      client.disconnect();
      this.logger.warn(`Socket connection rejected: ${error.message}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (!userId) return;

    this.onlineUsers.delete(userId);
    this.logger.log(`User ${userId} disconnected`);

    await this.usersService.updateUserById(userId, { online: false });
    (await this.usersService.getOnlineUsers(userId)).forEach(({ id }) => {
      if (this.onlineUsers.has(id))
        this.server.to(Array.from(this.onlineUsers.get(id))).emit('user_left', { id: userId });
    });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data.user.id;
    const receiverId = data.receiverId;
    const content = data.content;

    const conversation = await this.conversationsService.findOrCreate(
      { id: senderId } as any,
      { id: receiverId } as any
    );

    const message = await this.messagesService.create(
      conversation,
      { id: senderId } as any,
      content
    );

    if (this.onlineUsers.has(senderId)) {
      const senderSockets = this.onlineUsers.get(senderId);
      this.server.to(Array.from(senderSockets)).emit('message_sent', message);
    }

    if (this.onlineUsers.has(receiverId)) {
      const receiverSockets = this.onlineUsers.get(receiverId);
      this.server.to(Array.from(receiverSockets)).emit('new_message', message);
    }

    return message;
  }
}
