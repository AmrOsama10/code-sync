import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from './config/env/dev.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomMemberModule } from './modules/room-member/room-member.module';
import { FileModule } from './modules/file/file.module';
import { CronService } from '@common/helpers/cron';
import { MessageModule } from './modules/message/message.module';
import { GatewayModule } from '@modules/gateway/gateway.module';
import { CodeModule } from '@modules/code/code.module';
import { RedisModule } from '@nestjs-modules/ioredis';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [devConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('db').url,
      }),
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoomModule,
    RoomMemberModule,
    FileModule,
    MessageModule,
    GatewayModule,
    CodeModule,
  ],
  controllers: [AppController],
  providers: [AppService,CronService],
})
export class AppModule {}
