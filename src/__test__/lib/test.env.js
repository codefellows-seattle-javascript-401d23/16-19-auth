
process.env.NODE_ENV = 'development';
process.env.PORT = 5900;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.STUFF_SECRET = 'WAkQhkKbgBxgaD3j4l46Ov0H4lJSPq3YQtMS97fUWMe0K4RNFJepYSAYiOWLyp8dt6zBBGoz0uAzisS2N4yV4D';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'JKFDSAJLKFJDSAHFJHDAFHKADJLAFJDSKSADHJKFLA';
  process.env.AWS_ACCESS_KEY_ID = 'fakeyjfkdalf';
  require('./setup');
} else {
  //
  require('dotenv').config();
}
