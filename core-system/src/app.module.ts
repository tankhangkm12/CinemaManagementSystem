import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { BookingModule } from './modules/booking/booking.module';
import { ShowtimeModule } from './modules/showtime/showtime.module';
import { MovieModule } from './modules/movie/movie.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from './common/logger/logger.module';
import config from './common/configs/config';
import { envValidationSchema } from './common/configs/env.validation';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PlanModule } from './modules/plan/plan.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationGuard } from './common/guard/authentication.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthorizationGuard } from './common/guard/authorization.guard';
import { RoleModule } from './modules/role/role.module';
import { RenewTokenInterceptor } from './common/interceptors/renew-token.interceptor';
import { CinemaModule } from './modules/cinema/cinema.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [config],
      validationSchema: envValidationSchema,
      validationOptions : {
        abortEarly : true
      }
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
    TenantModule,
    MovieModule,
    ShowtimeModule,
    BookingModule,
    TicketModule,
    PaymentModule,
    LoggerModule,
    DatabaseModule,
    PlanModule,
    CacheModule,
    RoleModule,
    CinemaModule
  ],
  providers : [
    {
      provide : APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RenewTokenInterceptor
    }
  ]
})
export class AppModule {}
