import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schemas/tenant';
import { MongoDbTenantRepository, TenantRepository } from './tenant.repository';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    PlanModule
  ],
  controllers: [TenantController],
  providers: [
    TenantService,
    {
      provide : TenantRepository,
      useClass : MongoDbTenantRepository
    }
  ],
  exports: [TenantService],
})
export class TenantModule {}
