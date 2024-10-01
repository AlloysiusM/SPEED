import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/speed-db'), // Your MongoDB connection
    ModerationModule,
  ],
})
export class AppModule {}
