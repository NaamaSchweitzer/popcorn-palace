
# Popcorn Palace Movie Ticket Booking System

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NaamaSchweitzer/popcorn-palace.git
   cd popcorn-palace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the database**

   ```bash
   docker-compose up -d
   ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application will be available at http://localhost:3000

## APIs

### Movies APIs

- `POST /movies` - Create a new movie
- `GET /movies/all` - Get all movies
- `POST /movies/update/:movieTitle` - Update a movie by title
- `DELETE /movies/:movieTitle` - Delete a movie by title

### Showtimes APIs

- `POST /showtimes` - Create a new showtime
- `GET /showtimes/:showtimeId` - Get showtime by ID
- `POST /showtimes/update/:showtimeId` - Update a showtime
- `DELETE /showtimes/:showtimeId` - Delete a showtime

### Bookings APIs

- `POST /bookings` - Create a new booking

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
