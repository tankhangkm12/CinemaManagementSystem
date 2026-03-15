// cinema.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Query, Types } from 'mongoose';
import {v4 as uuidv4} from 'uuid';

export type CinemaDocument = Cinema & Document;

@Schema({ _id: false })
class Location {
  @Prop({ required: true }) address !: string;
  @Prop({ required: true }) district !: string;
  @Prop({ required: true }) city !: string;
}

@Schema({ _id: false })
class OpeningHours {
  @Prop({ required: true }) open !: string;  // "08:00"
  @Prop({ required: true }) close !: string; // "23:00"
}

export enum CinemaStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true, collection: 'cinemas' })
export class Cinema {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenant_id !: Types.ObjectId;

  @Prop({type : String, default : () => uuidv4() })
  cinema_id !: Types.UUID

  @Prop({ required: true, trim: true })
  name !: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug !: string; // "cgv-vincom-dong-khoi"

  @Prop({ type: Location, required: true })
  location !: Location;

  @Prop({ type: OpeningHours, required: true })
  opening_hours !: OpeningHours;

  @Prop({ type: [String], default: [] })
  amenities !: string[]; // ['parking', 'food_court', 'imax', '4dx', 'dolby_atmos']

  @Prop({ trim: true, default: '' })
  description !: string;

  @Prop({ default: null })
  thumbnail ?: string; // URL ảnh đại diện

  @Prop({ type: [String], default: [] })
  images ?: string[]; // URL gallery

  @Prop({ type: String, enum: CinemaStatus, default: CinemaStatus.ACTIVE, index: true })
  status ?: CinemaStatus;

  @Prop({ type: Boolean, default: false, select: false })
  deleted : boolean = false

  @Prop({ type: Date,default: null })
  deletedAt?: Date | null; 
}

export const CinemaSchema = SchemaFactory.createForClass(Cinema);

CinemaSchema.pre(/^find/,function ( this : Query<any,any>) {
  this.where({ deleted : false})
})

CinemaSchema.pre(['findOneAndUpdate','updateOne','updateMany'],function (this : Query<any,any>) {
  const update = this.getUpdate()  as any;
   if (update?.deleted === true){
    update.deletedAt = new Date()
   } 
})

// Compound index: query theo tenant luôn kèm status
CinemaSchema.index({ tenant_id: 1, status: 1 });
CinemaSchema.index({ tenant_id: 1, slug: 1 }, { unique: true });