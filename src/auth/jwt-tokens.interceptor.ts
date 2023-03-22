import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, tap} from "rxjs";
import { Response } from 'express';

@Injectable()
export class JWTTokensInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap((response) => {
                if (!response) return

                if ('refresh_token' in response) {
                    const res = context.switchToHttp().getResponse<Response>();
                    const { refresh_token } = response;
                    res.cookie('refresh_token', refresh_token, { httpOnly: true });
                }

                if ('access_token' in response) {
                    const res = context.switchToHttp().getResponse<Response>();
                    const { access_token } = response;
                    res.cookie('access_token', access_token, { httpOnly: true });
                }
            }),
        );
    }
}
