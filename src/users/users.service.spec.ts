import {UsersService} from "./users.service";
import {Test, TestingModule} from "@nestjs/testing";
import {SequelizePostgresTestingModule} from "../test-utils/SequelizePostgresTestingModule";
import {User} from "./users.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";

describe('UsersService', () => {
    let module: TestingModule;
    let service: UsersService;
    const password = 'test12345'
    const email = 'sergii.nimerovsky@gmail.com'

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                    isGlobal: true
                }),
                SequelizePostgresTestingModule([User]),
                SequelizeModule.forFeature([User])
            ],
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    })

    afterEach( () => {
        service.clearDB()
    })

    afterAll(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const user = await service.create({
            email,
            password
        })

        expect(user.email).toEqual(email)
    });

    it('should find a user by email', async () => {
        await service.create({
            email,
            password
        })

        const user = await service.findOneByEmail(email)

        expect(user.email).toEqual(email)
    });

    it('should find a user by id', async () => {
        const newUser = await service.create({
            email,
            password
        })

        const user = await service.findOneById(newUser.id)

        expect(user.id).toEqual(newUser.id)
    });

    it('should update a user', async () => {
        const newUser = await service.create({
            email,
            password
        })

        const newEmail = 'updated.mail@gmail.com'

        await service.update(newUser.id, {
            email: newEmail
        })

        const user = await service.findOneById(newUser.id)

        expect(user.email).toEqual(newEmail)
    });
});
