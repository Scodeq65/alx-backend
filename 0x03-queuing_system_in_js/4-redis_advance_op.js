import { createClient, print } from 'redis';

// Create a Redis client
const client = createClient();

// Event listener for a successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to create and populate a hash
function createHash() {
  const key = 'HolbertonSchools';
  const values = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  for (const [field, value] of Object.entries(values)) {
    client.hset(key, field, value, print); // Use redis.print to log each hset operation
  }
}

// Function to display the hash
function displayHash() {
  const key = 'HolbertonSchools';

  client.hgetall(key, (err, obj) => {
    if (err) {
      console.error(`Error retrieving hash: ${err.message}`);
      return;
    }
    console.log(obj);
  });
}

// Call the functions
createHash();
displayHash();
