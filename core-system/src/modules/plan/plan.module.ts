import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schemas/plan';
import { MongoDbPlanRepository, PlanRepository } from './plan.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  controllers: [PlanController],
  providers: [
    PlanService,
    {
      provide: PlanRepository,
      useClass: MongoDbPlanRepository,
    }
  ],
  exports : [PlanService]
})
export class PlanModule {}
