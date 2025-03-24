import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  // help method for showtimes service
  async findOne(id: number) {
    const movie = await this.moviesRepository.findOneBy({ id });

    if (!movie) throw new NotFoundException(`Movie ID: "${id}" Not Found`);

    return movie;
  }

  // help method for movies service
  async findOneByTitle(title: string) {
    const movie = await this.moviesRepository.findOneBy({ title });

    if (!movie) throw new NotFoundException(`Movie "${title}" Not Found`);

    return movie;
  }

  async findAll() {
    return this.moviesRepository.find();
  }

  async create(createMovieDto: CreateMovieDto) {
    const newMovie = this.moviesRepository.create(createMovieDto);
    return await this.moviesRepository.save(newMovie);
  }

  async update(title: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOneByTitle(title);
    await this.moviesRepository.update(movie.id, updateMovieDto);
  }

  async delete(title: string) {
    const movie = await this.findOneByTitle(title);
    await this.moviesRepository.remove(movie);
  }
}
