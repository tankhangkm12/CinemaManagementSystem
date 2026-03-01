import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {


  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject(LoggerService) private readonly logger : LoggerService 
  ) {}

  async onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB connection error', error);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
    this.logger.log('MongoDB connection closed');
  }
}