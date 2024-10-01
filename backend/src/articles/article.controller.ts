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
import { EmailService } from '../emails/email.service'; // Import your EmailService

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly emailService: EmailService, // Inject EmailService
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
    @Body('url') url: string,
    @Body('email') email: string, // Add email parameter
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
        email, // Pass email to the service
      );

      // Optionally send a confirmation email
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
