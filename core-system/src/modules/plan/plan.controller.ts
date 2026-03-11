import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { RequirePermissions } from 'src/common/decorators/auth.metadata';

@Controller('api/v1/plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/new')
  @RequirePermissions('plan:create')
  async createPlan(@Body() createPlanDto : CreatePlanDto) {
    return await this.planService.createPlan(createPlanDto)
  }

  @Delete('/:code')
  @RequirePermissions('plan:delete')
  async deletePlan(@Param('code') code : string) {
    return await this.planService.deletePlan(code)
  }

  @Post('/:code/advantage-features')
  @RequirePermissions('plan:update')
  async addAverageFeatures(@Param('code') code : string, @Body('features') features : [string]) {
    console.log(code)
    return await this.planService.addAverageFeatures(code, features)
  }
}
