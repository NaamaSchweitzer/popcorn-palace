import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HttpExceptionFilter } from '../src/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let movieId: number;
  let showtimeId: number;
  // let bookingId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'popcorn-palace',
          password: 'popcorn-palace',
          database: 'popcorn-palace',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Movies API', () => {
    it('POST /movies - should create a new movie', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Sample Movie Title',
          genre: 'Action',
          duration: 120,
          rating: 8.7,
          releaseYear: 2025,
        })
        .expect(200) // success
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('Sample Movie Title');
          movieId = response.body.id;
        });
    });

    it('GET /movies/all - should return all movies', () => {
      return request(app.getHttpServer())
        .get('/movies/all')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('POST /movies/update/:movieTitle - should update a movie', () => {
      return request(app.getHttpServer())
        .post('/movies/update/Sample Movie Title')
        .send({
          rating: 9.0,
          genre: 'Romance',
        })
        .expect(200);
    });
  });

  describe('Showtimes API', () => {
    it('POST /showtimes - should create a new showtime', () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 3);

      return request(app.getHttpServer())
        .post('/showtimes')
        .send({
          movieId: movieId,
          price: 50.2,
          theater: 'Sample Theater',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
        .expect(200) // success
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          showtimeId = response.body.id;
        });
    });

    it('GET /showtimes/:id - should return showtime details', () => {
      return request(app.getHttpServer())
        .get(`/showtimes/${showtimeId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(showtimeId);
          expect(response.body).toHaveProperty('movie');
          expect(response.body.movie.id).toBe(movieId);
        });
    });
  });

  describe('Bookings API', () => {
    it('POST /bookings - should create a new booking', () => {
      const userId = uuidv4();

      return request(app.getHttpServer())
        .post('/bookings')
        .send({
          showtimeId: showtimeId,
          seatNumber: 10,
          userId: userId,
        })
        .expect(200) // created
        .then((response) => {
          expect(response.body).toHaveProperty('bookingId');
          // bookingId = response.body.bookingId;
        });
    });
  });
});
