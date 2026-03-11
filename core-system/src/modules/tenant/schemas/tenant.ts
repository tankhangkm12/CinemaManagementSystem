import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { nanoid } from 'nanoid';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {

    // identify tenant
    @Prop({ type: String, unique: true, default: () => nanoid(12) })
    tenant_id!: string;

    @Prop({ type: String, required: true, trim: true })
    name!: string;

    @Prop({ type: String, required: true, unique: true })
    slug!: string;

    @Prop({ type: Types.UUID, required: true })
    owner_id!: Types.UUID;

    // contact

    @Prop({ type: String, required: true, lowercase: true, trim: true })
    contact_email!: string;

    @Prop({ type: String })
    phone?: string;

    //subscription

    @Prop({
        _id: false,
        type: {
            plan_id: { type: Types.ObjectId, ref: 'Plan' },
            plan_code: { type: String, required: true },
            status: { type: String, enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE },
            started_at: Date,
            expires_at: Date,
        },
        required: true,
    })
    subscription!: {
        plan_id: Types.ObjectId;
        plan_code: string;
        status: SubscriptionStatus;
        started_at: Date;
        expires_at: Date;
    };


    @Prop({ type: Boolean, default: true })
    is_active!: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.index({ owner_id: 1, is_active: 1 });
TenantSchema.index({ 'subscription.expires_at': 1, is_active: 1 });

export type TenantDocument = HydratedDocument<Tenant>;