import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Book a ticket
  @Post() // POST /bookings
  @HttpCode(HttpStatus.OK)
  create(@Body(ValidationPipe) createDto: CreateBookingDto) {
    return this.bookingsService.create(createDto);
  }
}
