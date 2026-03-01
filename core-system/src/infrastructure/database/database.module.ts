import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongoConfig } from './database.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createMongoConfig,
    })
  ],
  providers: [DatabaseService],
  exports: [MongooseModule]
})
export class DatabaseModule {}
