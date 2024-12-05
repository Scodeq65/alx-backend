#!/usr/bin/env node

export default function createPushNotificationsJobs(jobs, queue) {
    // Check if jobs is an array
    if (!Array.isArray(jobs)) {
      throw new Error('Jobs is not an array');
    }
  
    // Iterate over each job in the jobs array
    jobs.forEach((jobData) => {
      // Create a job in the queue
      const job = queue.create('push_notification_code_3', jobData)
        .save((err) => {
          if (!err) {
            console.log(`Notification job created: ${job.id}`);
          }
        });
  
      // Handle job events
      job.on('complete', () => {
        console.log(`Notification job ${job.id} completed`);
      });
  
      job.on('failed', (errorMessage) => {
        console.log(`Notification job ${job.id} failed: ${errorMessage}`);
      });
  
      job.on('progress', (progress) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });
    });
  }
  