import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post, UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dtos/auth.dto";
import {GetCurrentUser} from "../commons/decorators/get-current-user.decorator";
import {JWTTokensInterceptor} from "./jwt-tokens.interceptor";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(JWTTokensInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: AuthDto,
        description: 'The credentials of the user',
    })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('profilePicture'))
    signup(@Body() dto: AuthDto, @UploadedFile() file: Express.Multer.File) {
        const profilePicture = file ? file.buffer : undefined
        return this.authService.signup(dto, profilePicture);
    }

    @ApiBody({
        type: AuthDto,
        description: 'The credentials of the user',
    })
    @ApiResponse({ status: 200, description: 'The user has been successfully authenticated.' })
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    @ApiCookieAuth('refresh_token')
    @ApiOperation({ summary: 'Refreshes the access token using the refresh token stored in a cookie.' })
    @Post('refresh')
    refreshTokens(
        @GetCurrentUser('id') userId: number,
        @GetCurrentUser('refresh_token') refreshToken: string,
    ) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
