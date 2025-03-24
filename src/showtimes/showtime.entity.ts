import { IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { Booking } from '../bookings/booking.entity';
import { Movie } from '../movies/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ type: 'float' })
  @IsPositive()
  price: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  theater: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}
