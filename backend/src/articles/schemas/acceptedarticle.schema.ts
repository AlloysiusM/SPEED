import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AcceptedArticle extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  journel: string;
  @Prop({ required: true })
  yearOfPub: string;
  @Prop({ required: true })
  volume: string;


  @Prop({ required: true })
  email: string;
  @Prop({ default: 'pending' }) // queued, rejected, accepted
  status: string;
}
export const AcceptedArticleSchema =
  SchemaFactory.createForClass(AcceptedArticle);
