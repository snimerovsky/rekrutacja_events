import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    password: string

    @IsNotEmpty()
    @IsOptional()
    profile_picture?: Buffer;
}
