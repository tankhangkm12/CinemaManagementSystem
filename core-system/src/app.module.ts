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
import databaseConfig from './common/configs/database.config';
import { envValidationSchema } from './common/configs/env.validation';
import { abort } from 'process';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PlanModule } from './modules/plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [databaseConfig],
      validationSchema: envValidationSchema,
      validationOptions : {
        abortEarly : true
      }
    }),
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
    PlanModule
  ]
})
export class AppModule {}
