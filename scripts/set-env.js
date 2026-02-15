const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configure the target file path
const targetPath = './src/environments/environment.ts';

// Create the content for the environment file
const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION || false},
  apiUrl: '${process.env.API_URL || "http://localhost:8000/api"}',
  reverbKey: '${process.env.REVERB_APP_KEY || ""}',
  reverbHost: '${process.env.REVERB_HOST || "localhost"}',
  reverbPort: ${process.env.REVERB_PORT || 8080},
  debugMode: ${process.env.DEBUG_MODE || true}
};
`;

// Write the file
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});
