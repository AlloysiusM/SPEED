import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArticleController } from './articles/article.controller';
import { ArticleService } from './articles/article.service';
import { Article, ArticleSchema } from './articles/schemas/article.schema';
import { EmailModule } from './emails/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.DB_URI), // Connect to MongoDB
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]), // Define Mongoose schema for Article
    EmailModule, // Register EmailModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class AppModule {}
