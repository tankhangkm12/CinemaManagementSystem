// src/modules/tenant/tenant.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

@Schema({
    timestamps: true,
    collection: 'tenant',
})
export class Tenant {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    name !: string;
    
    @Prop({
        type: String,
        required: true,
        unique: true,
        index: true,
    })
    api_key !: string;
    
    @Prop({
        type: {
            plan_id : String,
            status: String,
            next_billing: Date
        },
        default: null
    })
    subscription ?: {
        plan_id: string;
        status: SubscriptionStatus;
        next_billing: Date;
    };
    
    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
    })
    contact_email !: string;
    
    @Prop({
        type: Boolean,
        default: true,
    })
    is_active !: boolean;
    
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

export type TenantDocument = HydratedDocument<Tenant>;