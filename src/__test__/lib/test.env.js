process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.PHOTO_BOMB_SECRET = 'HynUc0hndJu1i0FjnUM9976KLMXHCffSXDYST9BYGhfIFjFvSJxeMXfRbyblMQpfStx5gXZew3r2YX1kmCay2NNpR2mM4ujzsZoq';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakseasdlfbbbbdddksladftttttttooooooowwwwwwwwwwmmm';
  process.env.AWS_ACCESS_KEY_ID = 'fakeafadfadkfhadkfhadkfhaskdfhakdfhdkfhad';
  require('./setup');
} else {
  require('dotenv').config();
}
