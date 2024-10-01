import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  email: string;
  @Prop({ default: 'pending' }) // queued, rejected, accepted
  status: string;
}
export const ArticleSchema = SchemaFactory.createForClass(Article);
