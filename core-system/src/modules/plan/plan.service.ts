import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PlanRepository } from './plan.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { checkAdvantageFeturesExist } from 'src/common/utils';

@Injectable()
export class PlanService {
    constructor(
        @Inject(PlanRepository) private readonly planRepository: PlanRepository,
        @Inject(LoggerService) private readonly logger : LoggerService
    ) {}
    

   async createPlan(createPlanDto : CreatePlanDto): Promise<any> {
        this.logger.log('Creating plan');
        const found = await this.planRepository.checkPlanExists(createPlanDto.code)
        if (found) {
            throw new BadRequestException('Plan already exists');
        }
        return await this.planRepository.createPlan(createPlanDto)
    }
    
    async deletePlan(code : string): Promise<any> {
        this.logger.log('Deleting plan');
        const updated = await this.planRepository.deletePlan(code)

        if (!updated) {
            throw new BadRequestException('Plan not found');
        }
        return updated
    }

    async addAverageFeatures(code : string, features : [string]): Promise<any> {
        this.logger.log('Adding average features');

        const valid = checkAdvantageFeturesExist(features)

        if (!valid) {
            throw new BadRequestException('Invalid features');
        }
        
        const updated = await this.planRepository.addAverageFeatures(code, features)

        if (!updated) {
            throw new BadRequestException('Plan not found');
        }
        return updated
    }

    async checkPlanExistByCode(code : string) : Promise<any> {
        return await this.planRepository.checkPlanExists(code)
    }
}
