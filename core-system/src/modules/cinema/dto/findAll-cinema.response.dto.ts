import { CinemaStatus } from "../schemas/cinema";

export class CinemaItemResponse {
  cinema_id !: string;
  name !: string;
  slug !: string;
  location !: {
    address: string;
    district: string;
    city: string;
  };
  opening_hours !: {
    open: string;
    close: string;
  };
  amenities !: string[];
  description !: string;
  thumbnail !: string | null;
  status !: CinemaStatus;
  createdAt !: Date;
  updatedAt !: Date;
}

export class FindAllCinemaResponse {
  data !: CinemaItemResponse[];
  meta !: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}