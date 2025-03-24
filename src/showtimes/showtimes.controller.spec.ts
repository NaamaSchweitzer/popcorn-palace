import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  // let service: ShowtimesService;

  const mockShowtimesService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    // service = module.get<ShowtimesService>(ShowtimesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new showtime by given data', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const showtime = {
        id: 1,
        ...createShowtimeDto,
        startTime: new Date(createShowtimeDto.startTime),
        endTime: new Date(createShowtimeDto.endTime),
      };

      jest.spyOn(mockShowtimesService, 'create').mockResolvedValue(showtime);

      const result = await controller.create(createShowtimeDto);

      expect(result).toEqual(showtime);
      expect(mockShowtimesService.create).toHaveBeenCalled();
      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
    });

    it('should throw BadRequestException when the chosen start/end time result in showtime duration shorter than the movie duration', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T14:47:46.125405Z',
        endTime: '2025-02-14T11:47:46.125405Z',
      };

      jest
        .spyOn(mockShowtimesService, 'create')
        .mockRejectedValue(
          new BadRequestException(
            'Start time and end time should be chosen so the showtime duration bigger than the movie duration',
          ),
        );

      await expect(controller.create(createShowtimeDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockShowtimesService.create).toHaveBeenCalled();
      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
    });

    it('should throw ConflictException when there is overlapping with another showtime', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater 2',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      jest
        .spyOn(mockShowtimesService, 'create')
        .mockRejectedValue(
          new ConflictException(
            `Showtime scheduled time is overlapping another scheduled showtime in theater "${createShowtimeDto.theater}"`,
          ),
        );

      await expect(controller.create(createShowtimeDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockShowtimesService.create).toHaveBeenCalled();
      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
    });
  });

  describe('findOne', () => {
    it('should find a showtime by a given id and return its data', async () => {
      const showtimeId = 1;
      const showtime = {
        id: showtimeId,
        price: 50.2,
        movieId: 1,
        theater: 'Sample Theater',
        startTime: new Date('2025-02-14T11:47:46.125405Z'),
        endTime: new Date('2025-02-14T14:47:46.125405Z'),
        movie: {
          id: 1,
          title: 'Sample Movie Title',
          genre: 'Action',
          duration: 120,
          rating: 8.7,
          releaseYear: 2025,
        },
      };

      jest.spyOn(mockShowtimesService, 'findOne').mockResolvedValue(showtime);

      const result = await controller.findOne(showtimeId);

      expect(result).toEqual(showtime);
      expect(mockShowtimesService.findOne).toHaveBeenCalled();
      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(showtimeId);
    });

    it('should throw NotFoundException when a showtime with the given id does not exist', async () => {
      const showtimeId = 500;

      jest
        .spyOn(mockShowtimesService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Showtime ID: "${showtimeId}" Not Found`),
        );

      await expect(controller.findOne(showtimeId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockShowtimesService.findOne).toHaveBeenCalled();
      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(showtimeId);
    });
  });

  describe('update', () => {
    it('should find a showtime by a given id and update its data', async () => {
      const showtimeId = 1;
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 50.2,
      };

      jest.spyOn(mockShowtimesService, 'update').mockResolvedValue(undefined);

      await controller.update(showtimeId, updateShowtimeDto);

      expect(mockShowtimesService.update).toHaveBeenCalled();
      expect(mockShowtimesService.update).toHaveBeenCalledWith(
        showtimeId,
        updateShowtimeDto,
      );
    });

    it('should throw NotFoundException when a showtime with the given id does not exist', async () => {
      const showtimeId = 500;
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 50.2,
      };

      jest
        .spyOn(mockShowtimesService, 'update')
        .mockRejectedValue(
          new NotFoundException(`Showtime ID: "${showtimeId}" Not Found`),
        );

      await expect(
        controller.update(showtimeId, updateShowtimeDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockShowtimesService.update).toHaveBeenCalled();
      expect(mockShowtimesService.update).toHaveBeenCalledWith(
        showtimeId,
        updateShowtimeDto,
      );
    });

    it('should throw BadRequestException when the chosen start/end time result in showtime duration shorter than the movie duration', async () => {
      const showtimeId = 1;
      const updateShowtimeDto: UpdateShowtimeDto = {
        startTime: '2025-02-14T14:47:46.125405Z',
        endTime: '2025-02-14T11:47:46.125405Z',
      };

      jest
        .spyOn(mockShowtimesService, 'update')
        .mockRejectedValue(
          new BadRequestException(
            'Start time and end time should be chosen so the showtime duration bigger than the movie duration',
          ),
        );

      await expect(
        controller.update(showtimeId, updateShowtimeDto),
      ).rejects.toThrow(BadRequestException);

      expect(mockShowtimesService.update).toHaveBeenCalled();
      expect(mockShowtimesService.update).toHaveBeenCalledWith(
        showtimeId,
        updateShowtimeDto,
      );
    });

    it('should throw ConflictException when there is overlapping with another showtime', async () => {
      const showtimeId = 1;
      const updateShowtimeDto: UpdateShowtimeDto = {
        theater: 'Sample Theater 2',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      jest
        .spyOn(mockShowtimesService, 'update')
        .mockRejectedValue(
          new ConflictException(
            `Showtime scheduled time is overlapping another scheduled showtime in theater "${updateShowtimeDto.theater}"`,
          ),
        );

      await expect(
        controller.update(showtimeId, updateShowtimeDto),
      ).rejects.toThrow(ConflictException);

      expect(mockShowtimesService.update).toHaveBeenCalled();
      expect(mockShowtimesService.update).toHaveBeenCalledWith(
        showtimeId,
        updateShowtimeDto,
      );
    });
  });

  describe('delete', () => {
    it('should find a showtime by a given id and delete', async () => {
      const showtimeId = 1;

      jest.spyOn(mockShowtimesService, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(showtimeId)).resolves.toBeUndefined();

      expect(mockShowtimesService.delete).toHaveBeenCalled();
      expect(mockShowtimesService.delete).toHaveBeenCalledWith(showtimeId);
    });

    it('should throw NotFoundException when a showtime with the given id does not exist', async () => {
      const showtimeId = 500;

      jest
        .spyOn(mockShowtimesService, 'delete')
        .mockRejectedValue(
          new NotFoundException(`Showtime ID: "${showtimeId}" Not Found`),
        );

      await expect(controller.delete(showtimeId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockShowtimesService.delete).toHaveBeenCalled();
      expect(mockShowtimesService.delete).toHaveBeenCalledWith(showtimeId);
    });
  });
});
