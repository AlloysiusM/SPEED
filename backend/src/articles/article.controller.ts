import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
} from '@nestjs/common';

import { ArticleService } from './article.service';
import { EmailService } from '../emails/email.service';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly emailService: EmailService,
  ) {}

  // Add this method
  @Get('pending')
  async getPendingArticles() {
    const pendingArticles = await this.articleService.getPendingArticles();
    return pendingArticles;
  }

  @Post('submit')
  async submitArticle(
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('journel') journel: string,
    @Body('yearOfPub') yearOfPub: string,
    @Body('volume') volume: string,
    @Body('numberOfPages') numberOfPages: string,
    @Body('doi') doi: string,
    @Body('email') email: string,

  ) {
    try {
      const isDuplicate = await this.articleService.isArticleDuplicate(
        title,
        doi,
      );

      if (isDuplicate) {
        throw new BadRequestException(
          'This article is already in the queue or has been rejected.',
        );
      }

      const newArticle = await this.articleService.submitArticle(
        title,
        author,
        journel,
        yearOfPub,
        volume,
        numberOfPages,
        doi,
        email, // Pass email to the service
      );

      // Send a confirmation email
      await this.emailService.sendEmail(
        email,
        'Article Submission Confirmation',
        `Thank you for submitting your article "${title}". It is currently pending approval.`,
      );

      return {
        message: 'Article submitted successfully!',
        article: newArticle,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to submit the article.');
    }
  }

  @Put(':id/accept')
  async acceptArticle(@Param('id') id: string) {
    const article = await this.articleService.acceptArticle(id);

    if (article) {
      await this.emailService.sendEmail(
        article.email, // Send email to the user's email
        'Your Article Has Been Accepted',
        `Congratulations! Your article "${article.title}" has been accepted.`,
      );
    }

    return article;
  }

  @Put(':id/reject')
  async rejectArticle(@Param('id') id: string) {
    const article = await this.articleService.rejectArticle(id);

    if (article) {
      await this.emailService.sendEmail(
        article.email, // Send email to the user's email
        'Your Article Has Been Rejected',
        `We're sorry to inform you that your article "${article.title}" has been rejected.`,
      );
    }

    return article;
  }
}
