// query/find-all-cinema.query.ts
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CinemaStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class FindAllCinemaQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(CinemaStatus)
  status?: CinemaStatus;

}