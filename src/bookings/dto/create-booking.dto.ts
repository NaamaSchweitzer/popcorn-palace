import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  showtimeId: number;

  @IsInt()
  @Min(1)
  @Max(200)
  seatNumber: number;

  @IsUUID()
  userId: string;
}
