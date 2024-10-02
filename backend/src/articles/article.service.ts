import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { EmailService } from '../emails/email.service'; // Import EmailService
import { RejectedArticle } from './schemas/rejectedarticle.schema';
import { AcceptedArticle } from './schemas/acceptedarticle.schema';
import { constants } from 'buffer';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(AcceptedArticle.name)
    private acceptedArticlesModel: Model<AcceptedArticle>,
    @InjectModel(RejectedArticle.name)
    private rejectedArticlesModel: Model<RejectedArticle>,
    private emailService: EmailService, // Inject EmailService
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
  async submitArticle(
    title: string,
    author: string,
    url: string,
    email: string, // Add email parameter here
  ): Promise<Article> {
    const newArticle = new this.articleModel({ title, author, url, email }); // Include email in the new article
    return newArticle.save();
  }

  async acceptArticle(articleId: string): Promise<Article | null> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { status: 'accepted' }, // Update the status to 'accepted'
        { new: true }, // Return the updated document
      )
      .exec();

    if (updatedArticle) {
      //put accepted branch
      await this.acceptedArticlesModel.create({
        title: updatedArticle.title,
        author: updatedArticle.author,
        url: updatedArticle.url,
        email: updatedArticle.email,
        status: 'accepted', // Set the status to accepted
      });

      // Send an email notification after accepting the article
      // await this.emailService.sendEmail(
      //   updatedArticle.email, // Use the email from the article
      //   'Your Article Has Been Accepted',
      //   `Congratulations! Your article "${updatedArticle.title}" has been accepted.`,
      // );
    }

    return updatedArticle;
  }

  async rejectArticle(articleId: string): Promise<Article | null> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { status: 'rejected' }, // Update the status to 'rejected'
        { new: true }, // Return the updated document
      )
      .exec();
    //put rejected branch
    await this.rejectedArticlesModel.create({
      title: updatedArticle.title,
      author: updatedArticle.author,
      url: updatedArticle.url,
      email: updatedArticle.email,
      status: 'rejected', // Set the status to accepted
    });

    return updatedArticle;
  }
}
