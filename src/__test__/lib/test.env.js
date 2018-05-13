process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.TEST_SECRET = 'Tv33tRX1150CuHtH9oaexr4IwUWHkjdD6fsj8Y4QllBs515Gv0BzR4TUYb4T8092FW5W6VEz9IksI27mRK6k771yR5ydbv4jz7kjR';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakestufasdjfklasdfjklasjdfkl';
  process.env.AWS_ACCESS_KEY_ID = 'fakekeyinsidetestenv';
  require('./setup');
} else {
  // remember to set your .env vars and add .env to .gitignore
  require('dotenv').config();
}
