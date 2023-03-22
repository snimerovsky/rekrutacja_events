import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {EventsService} from "./events.service";
import {CreateEventDto} from "./dtos/create-event.dto";
import {GetCurrentUser} from "../commons/decorators/get-current-user.decorator";
import {EventUserGuard} from "./event-user.guard";
import {UpdateEventDto} from "./dtos/update-event.dto";
import {GetEventDto} from "./dtos/get-event.dto";
import {GetAllEventsDto} from "./dtos/get-all-events.dto";
import {GetEventsStatisticsDto} from "./dtos/get-events-statistics.dto";
import {ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('events')
@Controller('event')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiBody({ type: CreateEventDto })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createEvent(@Body() createEventDto: CreateEventDto, @GetCurrentUser('id') userId: number) {
        return this.eventsService.create(createEventDto, userId);
    }

    @ApiCookieAuth('access_token')
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiOperation({ summary: 'Return all events.' })
    @ApiResponse({ status: 200, description: 'Returns all events.' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @Get('all')
    getAllEvents(@Query() getAllEventsDto: GetAllEventsDto,
                 @GetCurrentUser('id') userId: number
    ) {
        const {page, limit} = getAllEventsDto

        return this.eventsService.getAllEvents(page, limit, userId);
    }

    @ApiCookieAuth('access_token')
    @ApiQuery({ name: 'start_date', type: String, required: true })
    @ApiQuery({ name: 'end_date', type: String, required: true })
    @ApiOperation({ summary: 'Return events statistics.' })
    @ApiResponse({ status: 200, description: 'Returns events statistics.' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @Get('statistics')
    getEventsStatistics(@Query() getEventsStatisticsDto: GetEventsStatisticsDto,
                        @GetCurrentUser('id') userId: number
    ) {
        const {start_date, end_date} = getEventsStatisticsDto
        return this.eventsService.getEventsStatistics(new Date(start_date), new Date(end_date), userId);
    }

    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'id', type: String, description: 'Event ID' })
    @ApiOperation({ summary: 'Return the specified event.' })
    @ApiResponse({ status: 200, description: 'Returns the specified event.' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @Get('/:id')
    @UseGuards(EventUserGuard)
    getEvent(@Param() getEventDto: GetEventDto) {
        return this.eventsService.findOne(parseInt(getEventDto.id));
    }

    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'id', type: String, description: 'Event ID' })
    @ApiBody({ type: UpdateEventDto })
    @ApiOperation({ summary: 'Update an event' })
    @ApiResponse({ status: 200, description: 'Returns the updated event.' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @Put('/:id')
    @UseGuards(EventUserGuard)
    updateEvent(@Param() getEventDto: GetEventDto, @Body() body: UpdateEventDto) {
        return this.eventsService.update(parseInt(getEventDto.id), body);
    }

    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'id', type: String, description: 'Event ID' })
    @ApiOperation({ summary: 'Remove an event' })
    @ApiResponse({ status: 200, description: 'Event removed' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @Delete('/:id')
    @UseGuards(EventUserGuard)
    removeEvent(@Param() getEventDto: GetEventDto) {
        return this.eventsService.remove(parseInt(getEventDto.id));
    }
}
