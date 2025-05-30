import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { env } from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.name,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
