// create-cinema.dto.ts
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsArray, ValidateNested, Matches, IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { CinemaStatus } from '../schemas/cinema';

class LocationDto {
  @IsString() @IsNotEmpty()
  address !: string;

  @IsString() @IsNotEmpty()
  district !: string;

  @IsString() @IsNotEmpty()
  city !: string;
}

class OpeningHoursDto {
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'open must be HH:mm format' })
  open !: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'close must be HH:mm format' })
  close !: string;
}

export class CreateCinemaDto {

  @IsString() @IsNotEmpty()
  name !: string;

  @ValidateNested() @Type(() => LocationDto)
  location !: LocationDto;

  @ValidateNested() @Type(() => OpeningHoursDto)
  opening_hours !: OpeningHoursDto;

  @IsArray() @IsString({ each: true }) @IsOptional()
  amenities?: string[];

  @IsString() @IsOptional()
  description?: string;

  @IsUrl() @IsOptional()
  thumbnail?: string;

  @IsArray() @IsUrl({}, { each: true }) @IsOptional()
  images?: string[];

  @IsEnum(CinemaStatus) @IsOptional()
  status?: CinemaStatus;
}