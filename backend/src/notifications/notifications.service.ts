import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

    async create(message: string): Promise<Notification> {
        const newNotification = new this.notificationModel({ message });
        return await newNotification.save();
    }

    async findAll(): Promise<Notification[]> {
        return await this.notificationModel.find();
    }
}
