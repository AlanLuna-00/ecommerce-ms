import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import {User} from "./modules/user/user.entity";
import {AppConfig} from "./config/config.type";
import {CONFIG_KEYS} from "./config/constants";
import {UserModule} from "./modules/user/user.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
   TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<AppConfig>) => {
          const db = config.get(CONFIG_KEYS.DATABASE);
          return {
            type: 'mysql',
            host: db?.host,
            port: db?.port,
            username: db?.username,
            password: db?.password,
            database: db?.name,
            entities: [User],
            synchronize: true,
          };
        },
      }),
    UserModule,
  ],
})
export class AppModule {}
