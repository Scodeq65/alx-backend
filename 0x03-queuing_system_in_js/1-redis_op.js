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

// Function to set a new key-value pair
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Function to get and display the value of a key
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
      return;
    }
    console.log(value); // Log the retrieved value
  });
}

// Call the functions in sequence to ensure proper output
setNewSchool('Holberton', 'School'); // Reply: OK for setting 'Holberton'
displaySchoolValue('Holberton'); // Displays 'School'
setNewSchool('HolbertonSanFrancisco', '100'); // Reply: OK for setting 'HolbertonSanFrancisco'
displaySchoolValue('HolbertonSanFrancisco'); // Displays '100'
