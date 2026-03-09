import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import {v4 as uuidv4} from 'uuid';
@Schema({
    timestamps: true,
    collection: 'users'
})
export class User extends Document {
    @Prop({ type: String, required: true, default : uuidv4 })
    userId !: string

    @Prop({ type: String, required: true })
    name !: string

    @Prop({type: String, required: true})
    email !: string

    @Prop({type: String, required: true})
    password !: string

    @Prop({type: String, required: true})
    role_id !: string

    @Prop({type: String, default: null})
    tenant_id !: string

    @Prop({type: String,  unique : true})
    phone !: string

    @Prop({type: Boolean,default: true})
    is_active !: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({email: 1, is_active: 1},{unique: true})


export type UserDocument = HydratedDocument<User>

