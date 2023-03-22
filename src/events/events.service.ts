import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Event} from "./events.model";
import {CreateEventDto} from "./dtos/create-event.dto";
import { Op } from 'sequelize';
import {CronJob} from "cron";

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event) private eventRepository: typeof Event) {
        const job = new CronJob('0 0 0 * * 0', async () => {
            await this.deleteOldEvents();
        }, null, true);

        job.start();
    }

    async create(eventDto: CreateEventDto, userId: number) {
        const event = new Event();
        event.title = eventDto.title;
        event.start_date = new Date(eventDto.start_date);
        event.end_date = new Date(eventDto.end_date);
        event.user_id = userId;
        await event.save();
        return event;
    }

    findOne(eventId: number) {
        return this.eventRepository.findOne<Event>({where: {id: eventId}})
    }

    async update(id: number, attrs: Partial<Event>) {
        await this.eventRepository.update<Event>(attrs, {where: {id}})

        return await this.eventRepository.findByPk(id);
    }

    remove(id: number) {
        return this.eventRepository.destroy<Event>( {where: {id}})
    }

    async getAllEvents(page: number, limit: number, userId: number) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.eventRepository.findAndCountAll({
            offset,
            limit,
            where: {user_id: userId}
        });
        return { data: rows, count, page, limit };
    }

    async getEventsStatistics(startDate: Date, endDate: Date, userId: number) {
        const events = await this.eventRepository.findAll({
            where: {
                start_date: { [Op.gte]: startDate, [Op.lte]: endDate },
                user_id: userId
            },
            attributes: [
                [this.eventRepository.sequelize.fn('date', this.eventRepository.sequelize.col('start_date')), 'date'],
                [this.eventRepository.sequelize.fn('count', this.eventRepository.sequelize.col('*')), 'count'],
            ],
            group: [this.eventRepository.sequelize.fn('date', this.eventRepository.sequelize.col('start_date'))],
            raw: true,
        });

        const result: { [key: string]: number } = {};
        events.forEach((event: any) => {
            result[event.date] = event.count;
        });

        return result;
    }

    async deleteOldEvents(): Promise<void> {
        const now = new Date();
        await Event.destroy({ where: { end_date: { [Op.lt]: now } } });
    }

    clearDB() {
        return this.eventRepository.truncate()
    }
}
