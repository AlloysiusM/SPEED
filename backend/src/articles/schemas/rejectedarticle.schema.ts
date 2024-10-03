import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RejectedArticle extends Document {
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
  numberOfPages: string;
  @Prop({ required: true })
  doi: string;
  @Prop({ required: true })
  email: string;
  @Prop({ default: 'pending' }) // queued, rejected, accepted
  status: string;
}
export const RejectedArticleSchema = SchemaFactory.createForClass(RejectedArticle);
