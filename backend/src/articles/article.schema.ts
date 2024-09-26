import { Schema, Document } from 'mongoose';

export interface Article extends Document {
    title: string;
    content: string;
    status: 'accepted' | 'rejected' | 'pending';
}

export const ArticleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['accepted', 'rejected', 'pending'], default: 'pending' },
});
