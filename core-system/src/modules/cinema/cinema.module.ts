import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cinema, CinemaSchema } from './schemas/cinema';
import { CinemaRepository, MongoDbCinemaRepository } from './cinema.repository';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cinema.name,
        schema: CinemaSchema,
      },
    ]),
    TenantModule
  ],
  controllers: [CinemaController],
  providers: [
    CinemaService,
    {
      provide : CinemaRepository,
      useClass: MongoDbCinemaRepository
    }
  ],
})
export class CinemaModule {}
