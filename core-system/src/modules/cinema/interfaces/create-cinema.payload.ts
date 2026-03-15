// create-cinema.payload.ts
import { Types } from 'mongoose';
import { CinemaStatus } from '../schemas/cinema';

export interface LocationPayload {
  address: string;
  district: string;
  city: string;
}

export interface OpeningHoursPayload {
  open: string;
  close: string;
}

export interface CreateCinemaPayload {
  tenant_id: Types.ObjectId;   // inject từ JWT (không lấy từ body)
  name: string;
  slug: string;
  location: LocationPayload;
  opening_hours: OpeningHoursPayload;
  amenities?: string[];
  description?: string;
  thumbnail?: string;
  images?: string[];
  status?: CinemaStatus;
}