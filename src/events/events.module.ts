import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./events.model";
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        SequelizeModule.forFeature([Event]),
        JwtModule.register({})
    ],
    providers: [EventsService],
    controllers: [EventsController],
})
export class EventsModule {}
