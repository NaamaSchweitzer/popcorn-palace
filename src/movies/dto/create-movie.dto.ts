import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
// import { Transform } from 'class-transformer';

export class CreateMovieDto {
  //@Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsEnum(['Action', 'Romance', 'Comedy', 'Thriller', 'Drama', 'Horror'], {
  //   message: 'Valid genre required',
  // })
  // genre: 'Action' | 'Romance' | 'Comedy' | 'Thriller' | 'Drama' | 'Horror';
  @IsString()
  @IsNotEmpty()
  genre: string;

  // integer in range 0-500
  @IsInt()
  @IsPositive()
  duration: number;

  // double in range 0-10
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  // integer in range 1000 and 5 years from now
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear() + 5)
  releaseYear: number;
}
