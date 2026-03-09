import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { EnumActionPermission, EnumResourcePermission } from "../enum";


@Schema({
    timestamps: true,
    collection: 'permissions'
})
export class Permission extends Document{
    @Prop({required: true, lowercase: true})
    code !: string

    @Prop({
        type : String,
        required : true,
        enum : EnumResourcePermission
    })
    resource !: EnumResourcePermission


    @Prop({
        type: String,
        required: true, 
        enum : EnumActionPermission
    })
    action !: EnumActionPermission


    @Prop({
        type : String
    })
    description !: string

    @Prop({
        type : String,
        default: true
    })
    is_active !: boolean
    
}


export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ code: 1, is_active: 1 }, { unique: true });

export type PermissionDocument = HydratedDocument<Permission>