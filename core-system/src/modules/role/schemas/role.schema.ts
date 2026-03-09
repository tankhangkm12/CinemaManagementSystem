import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";


@Schema({
    timestamps: true,
    collection: 'roles'
})
export class Role extends Document{
    @Prop({required: true})
    code !: string

    @Prop({
        type : [Types.ObjectId],
        required : true,
        ref : 'Permission'
    })
    permissions_ids !: [Types.ObjectId]

    @Prop({
        type: String
    })
    description !: string

    @Prop({
        type : String,
        default: true
    })
    is_active !: boolean
    
}


export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ code: 1, is_active: 1 }, { unique: true });

export type RoleDocument = HydratedDocument<Role>