// create-cinema.response.ts
import { CinemaStatus } from '../schemas/cinema';

class LocationResponse {
  address !: string;
  district !: string;
  city !: string;
}

class OpeningHoursResponse {
  open !: string;
  close !: string;
}

export class CreateCinemaResponse {
  cinema_id !: string;
  name !: string;
  slug !: string;
  location !: LocationResponse;
  opening_hours !: OpeningHoursResponse;
  amenities !: string[];
  description !: string;
  thumbnail !: string | null;
  images !: string[];
}
