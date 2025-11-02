import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const cors = configService.get('cors');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || cors.origins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS: Origin not allowed'));
    },
  });
  app.setGlobalPrefix('api');
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Smart Communication Hub')
    .setDescription(
      'A smart communication hub that allows users chat with each other get a summary for their chats.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const appConfig = configService.get('app');
  await app.listen(appConfig.port);
}
bootstrap();
