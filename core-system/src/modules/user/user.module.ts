import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MongoDbUserRepository, UserRepository } from './user.repository';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports : [
    MongooseModule.forFeature([
      {
        name : User.name,
        schema: UserSchema
      }
    ]),
    TenantModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide : UserRepository,
      useClass: MongoDbUserRepository
    }
  ],
  exports : [UserModule]
})
export class UserModule {}
