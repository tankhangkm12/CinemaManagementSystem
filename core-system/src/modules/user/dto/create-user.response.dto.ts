// dto/response-user.dto.ts

class RoleResponseDto {
  role_id!: string;
  role_code!: string;
}

class TenantResponseDto {
  tenant_id!: string;
  tenant_name!: string;
}

export class CreateUserResponseDto {
  userId!: string;
  name!: string;
  email!: string;
  phone!: string;
  role!: RoleResponseDto;
  tenant!: TenantResponseDto | null;
  is_active?: boolean;
  createdAt?: Date;
}

export class GetUserResponseDto extends CreateUserResponseDto {}