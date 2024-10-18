import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from './schemas/article.schema';
import { EmailService } from '../emails/email.service'; 
import { RejectedArticle } from './schemas/rejectedarticle.schema';
import { AcceptedArticle } from './schemas/acceptedarticle.schema';
import { ExtractedArticle } from './schemas/extractedarticles.schema';
import { constants } from 'buffer';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(AcceptedArticle.name)
    private acceptedArticlesModel: Model<AcceptedArticle>,
    @InjectModel(RejectedArticle.name)
    private rejectedArticlesModel: Model<RejectedArticle>,
    private emailService: EmailService, 
    @InjectModel(ExtractedArticle.name)
    private extractedArticleModel: Model<ExtractedArticle>,
  ) {}

  async getPendingArticles() {
    const pendingArticles = await this.articleModel.find({
      status: 'pending',
    });
    return pendingArticles;
  }

  async getAcceptedArticles() {
    const getAcceptedArticles = await this.acceptedArticlesModel.find({
      status: 'accepted',
    });
    return getAcceptedArticles;
  }

  async getAcceptedArticle(id: string) {
    const getAcceptedArticle = await this.acceptedArticlesModel.find({
      status: 'accepted',
      _id: new Types.ObjectId(id),
    });
    return getAcceptedArticle;
  }

  // Check if the article is already in the queue or rejected
  async isArticleDuplicate(title: string, doi: string): Promise<boolean> {
    const existingArticle = await this.articleModel
      .findOne({
        $or: [{ title: title }, { doi: doi }],
        status: { $in: ['pending', 'rejected'] },
      })
      .exec();
    return !!existingArticle;
  }

  // Check if the article is already extracted
  async isExtractedArticleDuplicate(
    title: string,
    doi: string,
  ): Promise<boolean> {
    const existingExtractedArticle = await this.extractedArticleModel
      .findOne({
        $or: [{ title: title }, { doi: doi }],
      })
      .exec();
    return !!existingExtractedArticle;
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.articleModel.find().exec(); // Fetch all articles from the database
  }

  // Rate article
  async rateExtractedArticle(id: string, newRating: number): Promise<ExtractedArticle> {
    const article = await this.extractedArticleModel.findById(id);
    if (!article) {
      throw new NotFoundException('Extracted article not found');
    }

    article.rating = newRating;
    await article.save();
    return article;
  }

  // Submit a new article
  async submitArticle(
    title: string,
    author: string,
    journel: string,
    yearOfPub: string,
    volume: string,
    numberOfPages: string,
    doi: string,
    email: string,
  ): Promise<Article> {
    const newArticle = new this.articleModel({
      title,
      author,
      journel,
      yearOfPub,
      volume,
      numberOfPages,
      doi,
      email,
    });
    await newArticle.save(); // Save the article

    // Notify the moderator about the new article submission
    await this.emailService.sendEmail(
      process.env.MODERATOR_EMAIL, // Moderator's email address
      'New Article Submitted',
      `A new article titled "${newArticle.title}" has been submitted by ${newArticle.author}.`,
    );

    return newArticle;
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
        journel: updatedArticle.journel,
        yearOfPub: updatedArticle.yearOfPub,
        volume: updatedArticle.volume,
        numberOfPages: updatedArticle.numberOfPages,
        doi: updatedArticle.doi,
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
      journel: updatedArticle.journel,
      yearOfPub: updatedArticle.yearOfPub,
      volume: updatedArticle.volume,
      numberOfPages: updatedArticle.numberOfPages,
      doi: updatedArticle.doi,
      email: updatedArticle.email,
      status: 'rejected', // Set the status to accepted
    });

    return updatedArticle;
  }

  // Submit a new extracted article
  async extractArticle(
    title: string,
    author: string,
    journel: string,
    yearOfPub: string,
    volume: string,
    numberOfPages: string,
    doi: string,
    category: string,
    summary: string,
    
  ): Promise<ExtractedArticle> {
    const newExtract = new this.extractedArticleModel({
      title,
      author,
      journel,
      yearOfPub,
      volume,
      numberOfPages,
      doi,
      category,
      summary,
      
    });
    await newExtract.save(); // Save the newExtract

    // Notify the moderator about the new newExtract submission
    /*await this.emailService.sendEmail(
      process.env.MODERATOR_EMAIL, // Moderator's email address newExtract
      'New Article Submitted',
      `A new article titled "${newExtract.title}" has been submitted by ${newExtract.author}.`
    );*/

    return newExtract;
  }

  // Search for extracted articles
  // Search function to find articles by title or author
  async search(query: string): Promise<ExtractedArticle[]> {
    const searchRegex = new RegExp(query, 'i'); // 'i' flag makes the search case-insensitive

    return await this.extractedArticleModel
      .find({
        $or: [
          { title: { $regex: searchRegex } }, // Search by title
          { author: { $regex: searchRegex } }, // Search by author
      ],
      })
      .exec();
  }

}
