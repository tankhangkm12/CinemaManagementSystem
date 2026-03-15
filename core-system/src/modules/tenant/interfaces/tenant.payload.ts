import { Types } from 'mongoose';
import { SubscriptionStatus } from '../schemas/tenant';

export interface CreateTenantPayload {
  name: string;
  slug: string;
  contact_email: string;
  phone?: string;
  owner_id: Types.UUID;
  subscription: {
    plan_id: Types.ObjectId;
    plan_code: string; 
    status: SubscriptionStatus;
    started_at: Date;
    expires_at: Date;
  };
}