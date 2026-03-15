import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCinemaDto } from './create-cinema.dto';

export class UpdateCinemaDto extends PartialType(OmitType(CreateCinemaDto, ['images','amenities'] as const)) {}