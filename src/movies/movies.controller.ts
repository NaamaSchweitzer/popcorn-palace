import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get all movies
  @Get('all') // GET /movies/all
  async findAll() {
    return this.moviesService.findAll();
  }

  // Add a movie
  @Post() // POST /movies
  @HttpCode(HttpStatus.OK)
  async create(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  // Update a movie
  @Post('update/:movieTitle') // POST /movies/update/{movieTitle}
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(movieTitle, updateMovieDto);
  }

  // Delete a movie
  @Delete(':movieTitle') // DELETE /movies/{movieTitle}
  async delete(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.delete(movieTitle);
  }
}
