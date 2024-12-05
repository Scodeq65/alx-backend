#!/usr/bin/env node

import kue from 'kue';

// Create the queue
const queue = kue.createQueue();

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to process the notification jobs
function sendNotification(phoneNumber, message, job, done) {
  // start the progress
  job.progress(0, 100);

  // Chech if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Simulate sending notification
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  done();
}

// Process jobs from the queue `push_notification_code_2`
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
