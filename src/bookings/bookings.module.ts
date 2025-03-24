import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ShowtimesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
