import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Showtime } from '../showtimes/showtime.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  genre: string;

  @Column()
  @IsInt()
  @IsPositive()
  duration: number;

  @Column({ type: 'float' })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @Column()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear() + 5)
  releaseYear: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
