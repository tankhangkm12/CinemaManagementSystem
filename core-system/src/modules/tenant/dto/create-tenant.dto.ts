import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export enum SubscriptionDuration {
  ONE_MONTH = '1_month',
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  ONE_YEAR = '1_year',
}

class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  plan_code!: string;

  @IsEnum(SubscriptionDuration)
  @IsNotEmpty()
  duration!: SubscriptionDuration;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  contact_email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @Type(() => CreateSubscriptionDto)
  @IsNotEmpty()
  subscription!: CreateSubscriptionDto;
}