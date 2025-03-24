import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Repository } from 'typeorm';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    private readonly showtimesService: ShowtimesService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    // verify showtime exists
    await this.showtimesService.findOne(createBookingDto.showtimeId);

    // verify seat is not booked for another user in the same showtime
    const isBooked = await this.bookingsRepository.exists({
      where: {
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
      },
    });

    if (isBooked)
      throw new ConflictException(
        `Seat number ${createBookingDto.seatNumber} already booked for showtime ID ${createBookingDto.showtimeId}`,
      );

    const newBooking = this.bookingsRepository.create(createBookingDto);
    await this.bookingsRepository.save(newBooking);

    return { bookingId: newBooking.bookingId };
  }
}
