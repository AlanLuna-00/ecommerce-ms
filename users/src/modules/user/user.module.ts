import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../../config/env';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'jwt_secret',
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [env.rabbitmq.url],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [UserService],
  exports: [JwtModule],
})
export class UserModule {}
