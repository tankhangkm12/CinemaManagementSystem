import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AdvantageFeature } from "../plan.enum";

@Schema({ collection: 'plan' })
export class Plan {
  @Prop()
  code !: string; // basic, pro, enterprise

  @Prop({ required: true })
  name !: string;

  @Prop({ required: true })
  max_branches !: number;

  @Prop({ 
    type: [String],
    enum: AdvantageFeature,
    default: [] 
  })
  advantage_features !: [string];

  @Prop({ required: true })
  price !: number;

  @Prop({ required: true })
  unit_price !: string;

  @Prop({ default: true, select: false })
  is_active !: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

PlanSchema.index({ code: 1, is_active: 1 }, { unique: true });

export type PlanDocument = HydratedDocument<Plan>;