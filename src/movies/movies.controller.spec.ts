import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  // let service: MoviesService;

  const mockMoviesService = {
    findOne: jest.fn(),
    findOneByTitle: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    // service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies = [
        {
          id: 12345,
          title: 'Sample Movie Title 1',
          genre: 'Action',
          duration: 120,
          rating: 8.7,
          releaseYear: 2025,
        },
        {
          id: 67890,
          title: 'Sample Movie Title 2',
          genre: 'Comedy',
          duration: 90,
          rating: 7.5,
          releaseYear: 2024,
        },
      ];

      jest.spyOn(mockMoviesService, 'findAll').mockResolvedValue(movies);

      const result = await controller.findAll();

      expect(result).toEqual(movies);
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new movie by given data', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Sample Movie Title',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2025,
      };

      const movie = {
        id: 1,
        ...createMovieDto,
      };

      jest.spyOn(mockMoviesService, 'create').mockResolvedValue(movie);

      const result = await controller.create(createMovieDto);

      expect(result).toEqual(movie);
      expect(mockMoviesService.create).toHaveBeenCalled();
      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should find a movie by a given title and update its data', async () => {
      const movieTitle = 'Sample Movie Title';
      const updateMovieDto: UpdateMovieDto = {
        genre: 'Romance',
        duration: 130,
        rating: 8.8,
      };

      jest.spyOn(mockMoviesService, 'update').mockResolvedValue(undefined);

      await controller.update(movieTitle, updateMovieDto);

      expect(mockMoviesService.update).toHaveBeenCalledWith(
        movieTitle,
        updateMovieDto,
      );
    });

    it('should throw NotFoundException when a movie with the given title does not exist', async () => {
      const movieTitle = 'Sample Fake Movie Title';
      const updateMovieDto: UpdateMovieDto = {
        genre: 'Romance',
        duration: 130,
        rating: 8.8,
      };

      jest
        .spyOn(mockMoviesService, 'update')
        .mockRejectedValue(
          new NotFoundException(`Movie "${movieTitle}" Not Found`),
        );

      await expect(
        controller.update(movieTitle, updateMovieDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockMoviesService.update).toHaveBeenCalledWith(
        movieTitle,
        updateMovieDto,
      );
    });
  });

  describe('delete', () => {
    it('should find a movie by a given title and delete', async () => {
      const movieTitle = 'Sample Movie Title';

      jest.spyOn(mockMoviesService, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(movieTitle)).resolves.toBeUndefined();

      expect(mockMoviesService.delete).toHaveBeenCalledWith(movieTitle);
    });

    it('should throw NotFoundException when a movie with the given title does not exist', async () => {
      const movieTitle = 'Sample Fake Movie Title';

      jest
        .spyOn(mockMoviesService, 'delete')
        .mockRejectedValue(
          new NotFoundException(`Movie "${movieTitle}" Not Found`),
        );

      await expect(controller.delete(movieTitle)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockMoviesService.delete).toHaveBeenCalledWith(movieTitle);
    });
  });
});
