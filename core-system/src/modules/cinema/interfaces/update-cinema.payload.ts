import { CinemaStatus } from "../schemas/cinema";
import { LocationPayload, OpeningHoursPayload } from "./create-cinema.payload";

export interface UpdateCinemaPayload {
    name?: string;
    slug?: string;
    location?: LocationPayload;
    opening_hours?: OpeningHoursPayload;
    amenities?: string[];
    description?: string;
    thumbnail?: string;
    status?: CinemaStatus;
}