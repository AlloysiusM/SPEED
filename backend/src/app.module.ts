import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArticleController } from './articles/article.controller';
import { ArticleService } from './articles/article.service';
import { Article, ArticleSchema } from './articles/schemas/article.schema';
import { EmailModule } from './emails/email.module';
import {
  AcceptedArticle,
  AcceptedArticleSchema,
} from './articles/schemas/acceptedarticle.schema';
import {
  RejectedArticle,
  RejectedArticleSchema,
} from './articles/schemas/rejectedarticle.schema';

import {
  ExtractedArticle,
  ExtractedArticleSchema,
} from './articles/schemas/extractedarticles.schema';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.DB_URI), // Connect to MongoDB
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: AcceptedArticle.name, schema: AcceptedArticleSchema },
      { name: RejectedArticle.name, schema: RejectedArticleSchema },
      { name: ExtractedArticle.name, schema: ExtractedArticleSchema },
    ]),
    EmailModule, // Register EmailModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class AppModule {}
