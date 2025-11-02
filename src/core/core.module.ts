import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
  ],
  exports: [ConfigModule],
})
export class CoreModule {}
