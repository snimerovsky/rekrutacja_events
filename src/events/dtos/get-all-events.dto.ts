import {IsInt, Min} from "class-validator";
import {Transform} from "class-transformer";

export class GetAllEventsDto {
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page: number = 1;

    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    limit: number = 10;
}
