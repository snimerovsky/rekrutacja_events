import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {AuthDto} from "./dtos/auth.dto";
import {Tokens} from "./types/tokens.type";
import * as bcrypt from 'bcrypt'
import {JwtPayload} from "./types/jwtPayload.type";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
                private usersService: UsersService,
                private config: ConfigService) {}

    async signup(dto: AuthDto, profilePicture?: Buffer): Promise<Tokens> {
        const user = await this.usersService.findOneByEmail(dto.email)

        if (user) {
            throw new BadRequestException('email in use')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            profile_picture: profilePicture
        })

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signin(dto: AuthDto): Promise<Tokens> {
        const user = await this.usersService.findOneByEmail(dto.email)

        if (!user) throw new ForbiddenException('Access Denied');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async refreshTokens(user_id: number, refresh_token: string): Promise<Tokens> {
        const user = await this.usersService.findOneById(user_id)
        if (!user || !user.refresh_token) throw new ForbiddenException('Access Denied');

        const refreshTokenMatches = await bcrypt.compare(refresh_token, user.refresh_token);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshTokenHash(user_id: number, refresh_token: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

        await this.usersService.update(user_id, {
            refresh_token: hashedRefreshToken
        })
    }

    async getTokens(user_id: number, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            id: user_id,
            email: email,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token,
            refresh_token,
        }
    }
}
