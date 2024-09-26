import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationSchema } from './notification.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]), // Import Notification schema
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService], // Export NotificationsService to be used in other modules
})
export class NotificationsModule {}
