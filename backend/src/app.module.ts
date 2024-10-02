import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArticleController } from './articles/article.controller';
import { ArticleService } from './articles/article.service';
import { Article, ArticleSchema } from './articles/schemas/article.schema';
import { AcceptedArticle, AcceptedArticleSchema } from './articles/schemas/accepted-article.schema'; 
import { RejectedArticle, RejectedArticleSchema } from './articles/schemas/rejected-article.schema'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: AcceptedArticle.name, schema: AcceptedArticleSchema }]),
    MongooseModule.forFeature([{ name: RejectedArticle.name, schema: RejectedArticleSchema }]),
  ],
})
export class AppModule {}
