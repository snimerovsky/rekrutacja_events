import {UsersService} from "../users/users.service";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigModule} from "@nestjs/config";
import {User} from "../users/users.model";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dtos/create-user.dto";
import {JwtModule} from "@nestjs/jwt";
import {BadRequestException, ForbiddenException} from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    const userId = 1

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            findOneById: (id: number): Promise<User> => {
                const filteredUsers = users.filter((user) => user.id === id);
                return Promise.resolve(filteredUsers[0]);
            },
            findOneByEmail: (email: string): Promise<User> => {
                const filteredUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filteredUsers[0]);
            },
            create: (user_dto: CreateUserDto) => {
                const {email, password} = user_dto
                const user = {
                    id: userId,
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
            update: (id: number, attrs: Partial<User>) => {
                const filteredUser = users.filter((user) => user.id === id)[0];

                for (const [key, value] of Object.entries(attrs)) {
                    filteredUser[key] = value
                }

                return Promise.resolve([id]);
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                    isGlobal: true
                }),
                JwtModule.register({})
            ],
            providers: [AuthService, {
                provide: UsersService,
                useValue: fakeUsersService,
            }],
        }).compile();

        service = module.get(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw an error if user signs up with email that is in use', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'
        await service.signup({email, password});
        await expect(service.signup({email, password})).rejects.toThrowError(BadRequestException)
    })

    it('should sign up a new user', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'

        const result = await service.signup({email, password});
        expect(result.refresh_token).toBeDefined()
        expect(result.access_token).toBeDefined()
    })

    it('should throw if signin is called with an unused email', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'

        await expect(service.signin({email, password})).rejects.toThrowError(ForbiddenException);
    })

    it('should throw if an invalid password is provided', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'
        const sign_in_password = 'test123abc'

        await service.signup({email, password})

        await expect(service.signin({email, password: sign_in_password})).rejects.toThrowError(ForbiddenException);
    })

    it('should sign in a user', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'

        await service.signup({email, password});

        const result = await service.signin({email, password})

        expect(result.refresh_token).toBeDefined()
        expect(result.access_token).toBeDefined()
    })

    it('should throw if refreshTokens is called with an unused id', async () => {
        const refreshToken = 'refresh_token'

        await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrowError(ForbiddenException);
    })

    it('should throw if an invalid refresh token is provided', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'
        const refreshToken = 'refresh_token'

        await service.signup({email, password})

        await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrowError(ForbiddenException);
    })

    it('should refresh tokens', async () => {
        const email = 'asdf@asdf.com'
        const password = 'test123123123'

        const signUpResult = await service.signup({email, password})
        await new Promise(f => setTimeout(f, 1000));
        const result = await service.refreshTokens(userId, signUpResult.refresh_token)

        expect(result.refresh_token).toBeDefined()
        expect(result.access_token).toBeDefined()
        expect(result.refresh_token).not.toEqual(signUpResult.refresh_token)
        expect(result.access_token).not.toEqual(signUpResult.access_token)
    })
})
