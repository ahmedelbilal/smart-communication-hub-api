import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';
import { UsersModule } from '../src/users/users.module';
import { Conversation } from '../src/conversations/conversation.entity';
import { Message } from '../src/messages/message.entity';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Conversation, Message],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    jwtService = moduleFixture.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  const BASE = '/auth';
  const testUser = {
    name: 'test',
    email: 'test@example.com',
    password: 'Password123@',
  };

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post(`${BASE}/register`)
        .send(testUser)
        .expect(201);

      expect(res.body.access_token).toBeDefined();
    });

    it('should not register with same email twice', async () => {
      await request(app.getHttpServer()).post(`${BASE}/register`).send(testUser).expect(409);
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app.getHttpServer())
        .post(`${BASE}/register`)
        .send({ email: 'bademail', password: 'short', name: 'test' })
        .expect(400);

      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message[0]).toContain('email must be an email');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post(`${BASE}/login`)
        .send(testUser)
        .expect(200);

      expect(res.body.access_token).toBeDefined();

      // decode JWT to verify payload
      const payload = jwtService.decode(res.body.access_token) as any;
      expect(payload.email).toBe(testUser.email);
    });

    it('should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post(`${BASE}/login`)
        .send({ ...testUser, password: 'wrongpass' })
        .expect(401);
    });

    it('should fail for non-existent user', async () => {
      await request(app.getHttpServer())
        .post(`${BASE}/login`)
        .send({ email: 'nouser@example.com', password: 'whatever' })
        .expect(401);
    });
  });
});
