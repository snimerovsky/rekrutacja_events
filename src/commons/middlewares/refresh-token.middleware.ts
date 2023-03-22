import {ForbiddenException, Injectable, NestMiddleware} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {NextFunction, Request, Response} from "express";
import {JwtPayloadWithRefreshToken} from "../../auth/types/jwtPayloadWithRefreshToken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadWithRefreshToken,
        }
    }
}

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService,
                private config: ConfigService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies['refresh_token'];

        if (!refreshToken) {
            throw new ForbiddenException('Access denied')
        }

        try {
            const payload = await this.jwtService.verifyAsync(refreshToken,
                {
                    secret: this.config.get<string>('REFRESH_TOKEN_SECRET')
                })

            req.user = payload;
            req.user.refresh_token = refreshToken

            next()
        } catch (err) {
            throw new ForbiddenException('Access denied')
        }
    }
}
