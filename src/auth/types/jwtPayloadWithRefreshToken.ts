import {JwtPayload} from "./jwtPayload.type";

export type JwtPayloadWithRefreshToken = JwtPayload & { refresh_token: string };
