import {ForbiddenException, Injectable, NestMiddleware} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService,
                private config: ConfigService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const accessToken = req.cookies['access_token'];

        if (!accessToken) {
            throw new ForbiddenException('Access denied')
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken,
                {
                    secret: this.config.get<string>('ACCESS_TOKEN_SECRET')
                })

            req.user = payload;

            next()
        } catch (err) {
            throw new ForbiddenException('Access denied')
        }
    }
}
