import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Types } from 'mongoose';

@Controller('api/v1/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}


  @Post('new')
  async createTenant(@Body() createTenantDto : CreateTenantDto, @Req() req : any) : Promise<any> {
    return this.tenantService.createTenant(createTenantDto, req.userId);
  }

  @Get(':tenant_id/subscription')
  async getSubscriptionByTenantId(@Req() req : any,@Param('tenant_id') tenantId : string) : Promise<any> {
    console.log(tenantId);
    return this.tenantService.getSubscriptionByTenantId(tenantId, req.userId);
  }
}

