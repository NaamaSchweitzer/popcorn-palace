import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsInt()
  @Min(1)
  movieId: number;

  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
