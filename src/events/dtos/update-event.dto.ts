import {IsDateString, IsOptional, IsString} from "class-validator";

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    title: string

    @IsDateString()
    @IsOptional()
    start_date: Date;

    @IsDateString()
    @IsOptional()
    end_date: Date;
}
