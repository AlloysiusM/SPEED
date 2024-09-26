import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel('Article') private readonly articleModel: Model<Article>,
        private readonly notificationsService: NotificationsService,
    ) {}

    async create(createArticleDto: CreateArticleDto): Promise<Article> {
        const newArticle = new this.articleModel(createArticleDto);
        return await newArticle.save();
    }

    async updateStatus(id: string, status: 'accepted' | 'rejected'): Promise<Article> {
        const updatedArticle = await this.articleModel.findByIdAndUpdate(id, { status }, { new: true });

        // Create a notification
        const message = `Your article "${updatedArticle.title}" has been ${status}.`;
        await this.notificationsService.create(message);

        return updatedArticle;
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find();
    }
}
