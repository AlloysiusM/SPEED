import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleSchema } from './article.schema';
import { NotificationsModule } from '../notifications/notifications.module'; // Import NotificationsModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
        NotificationsModule, // Add NotificationsModule here
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService],
})
export class ArticlesModule {}
