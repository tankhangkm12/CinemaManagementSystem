import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayUnique,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdvantageFeature } from '../plan.enum';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  code!: string; // basic, pro, enterprise

  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  max_branches!: number;

  @IsArray()
  @ArrayUnique()
  @IsEnum(AdvantageFeature, { each: true })
  @IsOptional()
  advantage_features?: AdvantageFeature[];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  unit_price!: string; // month, year...

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}