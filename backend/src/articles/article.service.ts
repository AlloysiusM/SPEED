import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { AcceptedArticle } from './schemas/accepted-article.schema'; // Import accepted article schema
import { RejectedArticle } from './schemas/rejected-article.schema'; // Import rejected article schema

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(AcceptedArticle.name) private acceptedArticleModel: Model<AcceptedArticle>, // Inject accepted article model
    @InjectModel(RejectedArticle.name) private rejectedArticleModel: Model<RejectedArticle>, // Inject rejected article model
  ) {}

  async getPendingArticles() {
    const pendingArticles = await this.articleModel.find({
      status: 'pending',
    });
    return pendingArticles;
  }

  // Check if the article is already in the queue or rejected
  async isArticleDuplicate(title: string, url: string): Promise<boolean> {
    const existingArticle = await this.articleModel
      .findOne({
        $or: [{ title: title }, { url: url }],
        status: { $in: ['pending', 'rejected'] },
      })
      .exec();
    return !!existingArticle;
  }

  // Submit a new article
  async submitArticle(title: string, author: string, url: string): Promise<Article> {
    const newArticle = new this.articleModel({ title, author, url });
    return newArticle.save();
  }

  // Accept an article and move it to the accepted collection
  async acceptArticle(articleId: string): Promise<AcceptedArticle | null> {
    const article = await this.articleModel.findById(articleId);
    
    if (article) {
      // Create a new document in the accepted collection
      const acceptedArticle = new this.acceptedArticleModel({
        title: article.title,
        author: article.author,
        url: article.url,
        status: 'accepted',
      });
      await acceptedArticle.save(); // Save to acceptedArticles collection

      // Remove the article from the original collection
      await this.articleModel.findByIdAndDelete(articleId);
      
      return acceptedArticle; // Return the newly created accepted article
    }
    return null;
  }

  // Reject an article and move it to the rejected collection
  async rejectArticle(articleId: string): Promise<RejectedArticle | null> {
    const article = await this.articleModel.findById(articleId);
    
    if (article) {
      // Create a new document in the rejected collection
      const rejectedArticle = new this.rejectedArticleModel({
        title: article.title,
        author: article.author,
        url: article.url,
        status: 'rejected',
      });
      await rejectedArticle.save(); // Save to rejectedArticles collection

      // Remove the article from the original collection
      await this.articleModel.findByIdAndDelete(articleId);
      
      return rejectedArticle; // Return the newly created rejected article
    }
    return null;
  }
}
