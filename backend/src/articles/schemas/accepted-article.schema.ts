import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AcceptedArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: 'accepted' })
  status: string;
}

export const AcceptedArticleSchema = SchemaFactory.createForClass(AcceptedArticle);
