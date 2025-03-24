import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  // Get showtime by ID
  @Get(':showtimeId') // GET /showtimes/{showtimeId}
  findOne(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.showtimesService.findOne(showtimeId);
  }

  // Add a showtime
  @Post() // POST /showtimes
  @HttpCode(HttpStatus.OK)
  create(@Body(ValidationPipe) createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  // Update a showtime
  @Post('update/:showtimeId') // POST /showtimes/update/{showtimeId}
  @HttpCode(HttpStatus.OK)
  update(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body(ValidationPipe) updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(showtimeId, updateShowtimeDto); // should return void
  }

  // Delete a showtime
  @Delete(':showtimeId') // DELETE /showtimes/{showtimeId}
  delete(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.showtimesService.delete(showtimeId);
  }
}
