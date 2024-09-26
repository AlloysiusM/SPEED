import { Schema, Document } from 'mongoose';

export interface Notification extends Document {
    message: string;
    createdAt: Date;
}

export const NotificationSchema = new Schema({
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
