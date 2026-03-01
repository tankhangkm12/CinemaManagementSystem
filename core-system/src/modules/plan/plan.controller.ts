import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('api/v1/plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/new')
  async createPlan(@Body() createPlanDto : CreatePlanDto) {
    return await this.planService.createPlan(createPlanDto)
  }

  @Delete('/:code')
  async deletePlan(@Param('code') code : string) {
    return await this.planService.deletePlan(code)
  }

  @Post('/:code/advantage-features')
  async addAverageFeatures(@Param('code') code : string, @Body('features') features : [string]) {
    console.log(code)
    return await this.planService.addAverageFeatures(code, features)
  }
}
