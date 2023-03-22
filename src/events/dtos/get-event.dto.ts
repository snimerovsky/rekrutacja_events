import {IsNumberString} from "class-validator";

export class GetEventDto {
    @IsNumberString()
    id: string
}
