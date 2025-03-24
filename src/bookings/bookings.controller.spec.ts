import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BookingsController', () => {
  let controller: BookingsController;
  // let service: BookingsService;

  const mockBookingService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    // service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking by given data', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const bookingId = 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae';
      const booking = { bookingId };

      jest.spyOn(mockBookingService, 'create').mockResolvedValue(booking);

      const result = await controller.create(createBookingDto);

      expect(result).toEqual(booking);
      expect(mockBookingService.create).toHaveBeenCalled();
      expect(mockBookingService.create).toHaveBeenCalledWith(createBookingDto);
    });

    it('should throw NotFoundException when showtime does not exist', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 500,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      jest
        .spyOn(mockBookingService, 'create')
        .mockRejectedValue(
          new NotFoundException(
            `Showtime ID: "${createBookingDto.showtimeId}" Not Found`,
          ),
        );

      await expect(controller.create(createBookingDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockBookingService.create).toHaveBeenCalled();
      expect(mockBookingService.create).toHaveBeenCalledWith(createBookingDto);
    });

    it('should throw ConflictException when seat is already booked for the showtime', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      jest
        .spyOn(mockBookingService, 'create')
        .mockRejectedValue(
          new ConflictException(
            `Seat number ${createBookingDto.seatNumber} already booked for showtime ID ${createBookingDto.showtimeId}`,
          ),
        );

      await expect(controller.create(createBookingDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockBookingService.create).toHaveBeenCalled();
      expect(mockBookingService.create).toHaveBeenCalledWith(createBookingDto);
    });
  });
});
