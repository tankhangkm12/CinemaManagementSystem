import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { KeyService } from './key.service';
import { RoleModule } from '../role/role.module';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { AuthCacheRepository, RedisAuthCacheRepository } from './cache/auth.cache.repository';

@Module({
  imports :[
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService : ConfigService) => ({
        secret : configService.get('jwt').accessSecret,
        signOptions : {
          expiresIn : configService.get('jwt').accessExpiresIn
        }
      })
    }),
    RoleModule,
    CacheModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, KeyService, 
    {
      provide : AuthCacheRepository,
      useClass : RedisAuthCacheRepository
    }
  ],
  exports : [AuthService,JwtModule]
})
export class AuthModule {}
