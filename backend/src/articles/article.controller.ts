import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Console } from 'console';
import { Article } from './schemas/article.schema';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('pending')
  async getPendingArticles() {
    const articles = await this.articleService.getPendingArticles()
    return articles;
  }

  @Post('submit')
  async submitArticle(
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('url') url: string,
  ) {
    try {
      const isDuplicate = await this.articleService.isArticleDuplicate(
        title,
        url,
      );

      if (isDuplicate) {
        throw new BadRequestException(
          'This article is already in the queue or has been rejected.',
        );
      }

      const newArticle = await this.articleService.submitArticle(
        title,
        author,
        url,
      );
      return {
        message: 'Article submitted successfully!',
        article: newArticle,
      };
    } catch (error) {
      console.log(error);
    }
  }
  @Put(':id/accept')
  async acceptArticle(
   @Param('id')
   id: string,
  ){
    console.log('id');
    return await this.articleService.acceptArticle(id);
  }
  
  @Put(':id/reject')
  async rejectArticle(
   @Param('id')
   id: string,
  ){
    console.log('id');
    return await this.articleService.rejectArticle(id);
  }
}
