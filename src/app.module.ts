import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {SequelizeModule} from "@nestjs/sequelize";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {User} from "./users/users.model";
import { EventsModule } from './events/events.module';
import {Event} from "./events/events.model";
import {RefreshTokenMiddleware} from "./commons/middlewares/refresh-token.middleware";
import {AccessTokenMiddleware} from "./commons/middlewares/access-token.middleware";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Event],
            autoLoadModels: true
        }),
        AuthModule,
        UsersModule,
        EventsModule,
        JwtModule.register({})
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RefreshTokenMiddleware).forRoutes('auth/refresh')
        consumer.apply(AccessTokenMiddleware).forRoutes('event*')
    }
}
