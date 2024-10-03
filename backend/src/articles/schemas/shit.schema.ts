import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ShitModel extends Document {


  @Prop({ required: true })
  email: string;
  @Prop({ default: 'pending' }) // queued, rejected, accepted
  status: string;
}
export const ShitSchema = SchemaFactory.createForClass(ShitModel);