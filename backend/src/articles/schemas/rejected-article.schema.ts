import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RejectedArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: 'rejected' })
  status: string;
}

export const RejectedArticleSchema = SchemaFactory.createForClass(RejectedArticle);
