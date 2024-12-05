#!/usr/bin/env node

import express from 'express';
import kue from 'kue';
import { promisify } from 'util';
import redis from 'redis';

// Redis client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

// Reserve seats in Redis
function reserveSeat(number) {
  client.set('available_seats', number);
}

// Get current available seats using promisify
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10);
}

// Initialize Redis data
reserveSeat(50);
let reservationEnabled = true;

// Kue queue setup
const queue = kue.createQueue();

// Express server setup
const app = express();
const port = 1245;

// Route: GET /available_seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// Route: GET /reserve_seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route: GET /process
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();

    if (currentSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    const newSeats = currentSeats - 1;
    reserveSeat(newSeats);

    if (newSeats === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
