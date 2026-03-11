// interfaces/user.payload.ts

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: {
    role_id: string;
    role_code: string;
  };
  tenant?: {
    tenant_id: string;
    tenant_name: string;
  } | null;
  is_active?: boolean;
};