// dto/response-tenant.dto.ts

class SubscriptionResponseDto {
  plan_id!: string;
  started_at!: Date;
  expires_at!: Date;
}

export class CreateTenantResponseDto {
  tenant_id!: string;
  name!: string;
  slug!: string;
  contact_email!: string;
  phone?: string;
  subscription!: SubscriptionResponseDto;
}