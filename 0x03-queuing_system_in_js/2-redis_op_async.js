import { createClient, print } from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = createClient();

// Promisify the client.get method for async/await usage
const getAsync = promisify(client.get).bind(client);

// Event listener for a successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a new key-value pair
function setNewSchool(schoolName, value, shouldPrint = true) {
  if (shouldPrint) {
    client.set(schoolName, value, print); // Logs Reply: OK
  } else {
    client.set(schoolName, value); // No Reply: OK
  }
}

// Async function to get and display the value of a key
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName); // Await the promisified get method
    console.log(value);
  } catch (err) {
    console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
  }
}

// Async function to ensure proper sequencing
async function main() {
  setNewSchool('Holberton', 'School'); // Only the first call logs Reply: OK
  await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay to ensure set operation completes
  await displaySchoolValue('Holberton'); // Display the value for 'Holberton'

  setNewSchool('HolbertonSanFrancisco', '100', false); // Suppress the second Reply: OK
  await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay to ensure set operation completes
  await displaySchoolValue('HolbertonSanFrancisco'); // Display the value for 'HolbertonSanFrancisco'
}

// Call the main function
main();
