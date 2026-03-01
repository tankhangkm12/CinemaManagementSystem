import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const createMongoConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {

  const mongo = configService.get('mongo');

  console.log({mongo})

  return {
    uri: `${mongo.uri}`,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
  };
};