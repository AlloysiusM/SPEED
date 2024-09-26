import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.schema';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
        return this.articlesService.create(createArticleDto);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: 'accepted' | 'rejected'): Promise<Article> {
        return this.articlesService.updateStatus(id, status);
    }

    @Get()
    async findAll(): Promise<Article[]> {
        return this.articlesService.findAll();
    }
}
