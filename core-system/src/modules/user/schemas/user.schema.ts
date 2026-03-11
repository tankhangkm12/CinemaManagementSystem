import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {v4 as uuidv4} from 'uuid';
@Schema({
    timestamps: true,
    collection: 'users'
})
export class User {
    @Prop({ type: String, required: true, default : uuidv4 })
    userId !: string

    @Prop({ type: String, required: true })
    name !: string

    @Prop({type: String, required: true,unique : true})
    email !: string

    @Prop({type: String, required: true})
    password !: string

    @Prop({
        _id: false,
        type: {
            role_id: { type: String, required: true },
            role_code: { type: String, required: true },
        },
        required: true,
    })
    role!: {
        role_id: string;
        role_code: string;
    };

    @Prop({
        _id: false,
        type: {
            tenant_id: { type: String, default: null },
            tenant_name: { type: String, default: null },
        },
        default: null,
    })
    tenant?: {
        tenant_id: string;
        tenant_name: string;
    } | null;

    @Prop({type: String,  unique : true})
    phone !: string

    @Prop({type: Boolean,default: true})
    is_active !: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>

