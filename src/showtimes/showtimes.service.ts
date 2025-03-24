import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { Between, Not, Repository } from 'typeorm';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    private readonly moviesService: MoviesService,
  ) {}

  async findOne(showtimeId: number) {
    const showtime = await this.showtimesRepository.findOne({
      where: { id: showtimeId },
      relations: ['movie'],
    });

    if (!showtime)
      throw new NotFoundException(`Showtime ID: "${showtimeId}" Not Found`);

    return showtime;
  }

  async create(createShowtimeDto: CreateShowtimeDto) {
    const { movieId, startTime, endTime, theater } = createShowtimeDto;

    // verify movie with movieId exists
    const movie = await this.moviesService.findOne(movieId);

    // verify showtime's duration (end - start) match to the movie's duration
    // (by that we also make sure startTime is before endTimw)
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    const showtimeDuration =
      (endTimeDate.getTime() - startTimeDate.getTime()) / 60000;

    if (showtimeDuration < movie.duration)
      throw new BadRequestException(
        'Start time and end time should be chosen so the showtime duration bigger than the movie duration',
      );

    // verify there is no overlapping with another showtime for the same theater
    const isOverlapping = await this.showtimesRepository.exists({
      where: { theater, startTime: Between(startTimeDate, endTimeDate) },
    });

    if (isOverlapping)
      throw new ConflictException(
        `Showtime scheduled time is overlapping another scheduled showtime in theater "${theater}"`,
      );

    const newShowtime = this.showtimesRepository.create({
      ...createShowtimeDto,
      startTime: startTimeDate,
      endTime: endTimeDate,
    });

    return this.showtimesRepository.save(newShowtime);
  }

  async update(showtimeId: number, updateShowtimeDto: UpdateShowtimeDto) {
    const showtime = await this.findOne(showtimeId);

    let movieDuration = showtime.movie.duration;

    if (updateShowtimeDto.movieId) {
      const movie = await this.moviesService.findOne(updateShowtimeDto.movieId);
      movieDuration = movie.duration;
    }

    const startTimeDate = updateShowtimeDto.startTime
      ? new Date(updateShowtimeDto.startTime)
      : showtime.startTime;

    const endTimeDate = updateShowtimeDto.endTime
      ? new Date(updateShowtimeDto.endTime)
      : showtime.endTime;

    const showtimeDuration =
      (endTimeDate.getTime() - startTimeDate.getTime()) / 60000;

    if (showtimeDuration < movieDuration) {
      throw new BadRequestException(
        'Start time and end time should be chosen so the showtime duration bigger than the movie duration',
      );
    }

    if (
      updateShowtimeDto.startTime ||
      updateShowtimeDto.endTime ||
      updateShowtimeDto.theater
    ) {
      const theater = updateShowtimeDto.theater || showtime.theater;

      const isOverlapping = await this.showtimesRepository.exists({
        where: {
          id: Not(showtimeId),
          theater,
          startTime: Between(startTimeDate, endTimeDate),
        },
      });

      if (isOverlapping) {
        throw new ConflictException(
          `Showtime scheduled time is overlapping another scheduled showtime in theater "${theater}"`,
        );
      }
    }

    await this.showtimesRepository.update(
      { id: showtimeId },
      {
        ...updateShowtimeDto,
        startTime: startTimeDate,
        endTime: endTimeDate,
      },
    );
  }

  async delete(showtimeId: number) {
    const showtime = await this.findOne(showtimeId);
    await this.showtimesRepository.remove(showtime);
  }
}
