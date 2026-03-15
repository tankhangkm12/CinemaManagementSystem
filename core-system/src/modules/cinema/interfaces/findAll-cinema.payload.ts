import { CinemaStatus } from "../schemas/cinema";

export interface FindAllCinemaPayload {
  status ?: CinemaStatus;
  page ?: number;
  limit ?: number;
}