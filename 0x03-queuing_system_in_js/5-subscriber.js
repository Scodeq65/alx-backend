import { createClient } from 'redis';

// create redis client
const client = createClient();

// Event listerner for a successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the serveer: ${err.message}`);
});

// Subscribe to the channel 'Holberton school channel'
client.subscribe('holberton school channel');

// Handle incoming messages
client.on('message', (channel, message) => {
  console.log(message);

  if (message === 'KILL_SERVER') {
    client.unsubscribe(channel);
    client.quit();
  }
});
