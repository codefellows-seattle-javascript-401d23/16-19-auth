process.env.NODE_ENV = 'development';
process.env.PORT = 6000
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.THE_DESPERATE_SECRET = '!6b==<2-h32df~SGH<-!?ws.KVvn6CQ`5btMZV:&46r*}';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakeffkkfkeeeadkekkekadkekaffffaaakkkkeeee';
  process.env.AWS_ACCESS_KEY_ID = 'fkafaaaakkkaakkkeeeyyy';
  require('./setup');
} else {
  require('dotenv').config();
}
