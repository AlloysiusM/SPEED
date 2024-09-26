import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.schema';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    async create(@Body('message') message: string): Promise<Notification> {
        return this.notificationsService.create(message);
    }

    @Get()
    async findAll(): Promise<Notification[]> {
        return this.notificationsService.findAll();
    }
}
