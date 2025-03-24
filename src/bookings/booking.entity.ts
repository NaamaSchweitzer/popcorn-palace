import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsInt, IsUUID, Max, Min } from 'class-validator';
import { Showtime } from '../showtimes/showtime.entity';

@Entity('bookings')
@Unique(['showtimeId', 'seatNumber'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column()
  showtimeId: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  @IsInt()
  @Min(1)
  @Max(200)
  seatNumber: number;

  @Column()
  @IsUUID()
  userId: string;
}
