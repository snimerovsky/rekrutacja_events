import {IsDateString} from "class-validator";

export class GetEventsStatisticsDto {
    @IsDateString()
    start_date: Date;

    @IsDateString()
    end_date: Date;
}
