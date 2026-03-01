import { Controller } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}
}
