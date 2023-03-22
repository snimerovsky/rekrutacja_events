import {EventsService} from "./events.service";
import {Test, TestingModule} from "@nestjs/testing";
import {SequelizePostgresTestingModule} from "../test-utils/SequelizePostgresTestingModule";
import {Event} from "./events.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {User} from "../users/users.model";
import {UsersService} from "../users/users.service";

describe('EventsService', () => {
    let module: TestingModule;
    let service: EventsService;
    let usersService: UsersService;
    let user: User

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                    isGlobal: true
                }),
                SequelizePostgresTestingModule([Event, User]),
                SequelizeModule.forFeature([Event, User])
            ],
            providers: [EventsService, UsersService],
        }).compile();

        service = module.get<EventsService>(EventsService);
        usersService = module.get<UsersService>(UsersService);

        user = await usersService.create({
            email: 'test@gmail.com',
            password: 'test1231231'
        })
    });

    afterEach( () => {
        service.clearDB()
    })

    afterAll(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an event', async () => {
        const title = 'event'

        const event = await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        expect(event.title).toEqual(title)
    })

    it('should find an event by id', async () => {
        const title = 'event'

        const newEvent = await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        const event = await service.findOne(newEvent['id'])
        expect(event.title).toEqual(title)
    })

    it('should update an event', async () => {
        const title = 'event'
        const newTitle = 'updated_event'

        const event = await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        const updatedEvent = await service.update(event['id'], {title: newTitle})
        expect(updatedEvent.title).toEqual(newTitle)
    })

    it('should delete an event', async () => {
        const title = 'event'

        const newEvent = await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        await service.remove(newEvent['id'])

        const event = await service.findOne(newEvent['id'])
        expect(event).toBeNull()
    })

    it('should get all events', async () => {
        const title = 'event'

        await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        const events = await service.getAllEvents(1, 10, user['id'])
        expect(events.count).toEqual(1)
    })

    it('should get events statistics', async () => {
        const title = 'event'

        await service.create({
            title,
            start_date: new Date('2023-03-17'),
            end_date: new Date('2023-03-20')
        }, user['id'])

        await service.create({
            title,
            start_date: new Date('2023-03-20'),
            end_date: new Date('2023-03-23')
        }, user['id'])

        const events_statistics = await service.getEventsStatistics(new Date('2023-03-17'), new Date('2023-03-20'), user['id'])
        console.log('events_statistics', events_statistics)
        expect(events_statistics['2023-03-17']).toEqual('1')
        expect(events_statistics['2023-03-20']).toEqual('1')
    })

    it ('should delete old events', async () => {
        const title = 'event'

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const yesterdayNewEvent = await service.create({
            title,
            start_date: yesterday,
            end_date: yesterday
        }, user['id'])

        const tomorrowNewEvent = await service.create({
            title,
            start_date: tomorrow,
            end_date: tomorrow
        }, user['id'])

        await service.deleteOldEvents()

        const yesterdayEvent = await service.findOne(yesterdayNewEvent['id'])
        const tomorrowEvent = await service.findOne(tomorrowNewEvent['id'])
        expect(yesterdayEvent).toBeNull()
        expect(tomorrowEvent.title).toEqual(title)
    })

})
