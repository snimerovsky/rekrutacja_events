import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {EventsService} from "./events.service";

@Injectable()
export class EventUserGuard implements CanActivate {
    constructor(private eventsService: EventsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const eventId = parseInt(req.body['id']) || parseInt(req.params['id']);

        if (!eventId) {
            throw new NotFoundException('Event not found');
        }

        try {
            const event = await this.eventsService.findOne(eventId)
            return event.user_id === req.user.id;
        } catch (err) {
            return false;
        }
    }
}
