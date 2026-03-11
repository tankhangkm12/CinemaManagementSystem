import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TenantRepository } from './tenant.repository';
import { CreateTenantDto, SubscriptionDuration } from './dto/create-tenant.dto';
import { CreateTenantPayload } from './interfaces/tenant.payload';
import { SubscriptionStatus } from './schemas/tenant';
import { PlanService } from '../plan/plan.service';
import { createSlug } from 'src/common/utils';
import { CreateTenantResponseDto } from '../plan/dto/create-plan.response.dto';

const DURATION_MONTHS: Record<SubscriptionDuration, number> = {
  [SubscriptionDuration.ONE_MONTH]: 1,
  [SubscriptionDuration.THREE_MONTHS]: 3,
  [SubscriptionDuration.SIX_MONTHS]: 6,
  [SubscriptionDuration.ONE_YEAR]: 12,
};

@Injectable()
export class TenantService {
  constructor(
    @Inject(TenantRepository) private readonly tenantRepository: TenantRepository,
    @Inject(PlanService) private readonly planService: PlanService,
  ) {}


  async createTenant(dto: CreateTenantDto, ownerId: Types.UUID) : Promise<CreateTenantResponseDto>{
    // 1. Gen slug
    const slug = createSlug(dto.name);

    // 2. Check duplicate
    const isExist = await this.tenantRepository.checkTenantExistBySlug(slug);
    if (isExist) {
      throw new ConflictException('Tenant already exist');
    }

    // 3. Resolve plan
    const foundPlan = await this.planService.checkPlanExistByCode(dto.subscription.plan_code);
    if (!foundPlan) {
      throw new NotFoundException('Plan not found');
    }

    // 4. Tính dates
    const started_at = new Date();
    const expires_at = new Date(started_at);
    expires_at.setMonth(expires_at.getMonth() + DURATION_MONTHS[dto.subscription.duration]);

    // 5. Build payload
    const payload: CreateTenantPayload = {
      name: dto.name,
      slug,
      contact_email: dto.contact_email,
      phone: dto.phone,
      owner_id: ownerId,
      subscription: {
        plan_id: foundPlan._id,
        plan_code: foundPlan.code,
        status: SubscriptionStatus.ACTIVE,
        started_at,
        expires_at,
      },
    };

    // 6. Tạo tenant
    const newTenant = await this.tenantRepository.create(payload);
    
    if (!newTenant) {
      throw new InternalServerErrorException('Create tenant failed');
    }

    return {
      tenant_id: newTenant.tenant_id,
      name: newTenant.name,
      slug: newTenant.slug,
      contact_email: newTenant.contact_email,
      phone: newTenant.phone,
      subscription: {
        plan_id: newTenant.subscription.plan_id.toString(),
        started_at: newTenant.subscription.started_at,
        expires_at: newTenant.subscription.expires_at,
      },
    };
  }

  async checkTenantExistById(id: string): Promise<any> {
    return await this.tenantRepository.checkTenantExistById(id);
  }

  async getSubscriptionByTenantId(tenantId: string, ownerId: string): Promise<any> {
    const tenant = await this.tenantRepository.getSubscriptionByTenantId(tenantId,ownerId)

    if (!tenant) {
      throw new NotFoundException('Tenant not found')
    }

    return tenant.subscription;
  }
}