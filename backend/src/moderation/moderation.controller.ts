import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  // Get Accepted Articles
  @Get('accepted')
  async getAcceptedArticles(@Res() res) {
    const articles = await this.moderationService.getAcceptedArticles();
    return res.status(HttpStatus.OK).json(articles);
  }

  // Get Rejected Articles
  @Get('rejected')
  async getRejectedArticles(@Res() res) {
    const articles = await this.moderationService.getRejectedArticles();
    return res.status(HttpStatus.OK).json(articles);
  }
}
