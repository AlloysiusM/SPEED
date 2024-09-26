import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
    constructor(@InjectModel('Article') private readonly articleModel: Model<Article>) {}

    async create(createArticleDto: CreateArticleDto): Promise<Article> {
        const newArticle = new this.articleModel(createArticleDto);
        return await newArticle.save();
    }

    async updateStatus(id: string, status: 'accepted' | 'rejected'): Promise<Article> {
        return await this.articleModel.findByIdAndUpdate(id, { status }, { new: true });
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find();
    }
}
