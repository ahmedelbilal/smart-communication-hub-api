import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // userId -> socketId
  private onlineUsers = new Map<string, string>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
    private readonly authService: AuthService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('Missing token');

      const payload = await this.authService.verifyToken(token);
      const userId = payload.sub || payload.id;

      this.onlineUsers.set(userId, client.id);
      client.data.user = { id: userId };

      this.logger.log(`User ${userId} connected`);
    } catch (error) {
      client.disconnect();
      this.logger.warn(`Socket connection rejected: ${error.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([, socketId]) => socketId === client.id
    )?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  // 📨 When client emits "send_message"
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data.user.id;
    const receiverId = data.receiverId;
    const content = data.content;

    // find or create conversation
    const conversation = await this.conversationsService.findOrCreate(
      { id: senderId } as any,
      { id: receiverId } as any
    );

    // save message
    const message = await this.messagesService.create(
      conversation,
      { id: senderId } as any,
      content
    );

    // emit back to sender (confirmation)
    client.emit('message_sent', message);

    // emit to receiver if online
    const receiverSocketId = this.onlineUsers.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('new_message', message);
      this.logger.log(`Message sent from ${senderId} to ${receiverId}`);
    } else {
      this.logger.log(`Receiver ${receiverId} is offline`);
    }

    return message;
  }
}
