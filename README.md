**Author**: Daniel Shelton
**Version**: 1.0.1

# Overview
This is an application which performs CRUD operations via the Express framework to retreive, edit, add, and/or delete data from a MongoDB database consisting of accounts which have user-names, emails, passwords and that generate tokens per successful login/signup.

# Architecture
The main point of entry of this application is the index.js file which transpiles the app by utilizing the babel library. This application also utilizes multiple NPM libraries and .travis.yml for its CI. The 'lib' directory contains all the helper modules. The '__test__' directory contains the testing suite.

# Paths

POST ROUTE: Adds a new account to the MongoDB database.
- Successful POST operations result in a 200 status code.
- POST operations with missing required fields result in a 400 status code.
- POST operations containing a pre-existing unique value (e.g. email) will result in a 409 status code.
```javaScript
authRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username || !request.body.email || !request.body.password) {
    logger.log(logger.INFO, 'Invalid request');
    throw new HttpError(400, 'Invalid request.');
  }
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log('logger.INFO', 'AUTH - creating TOKEN.');
      return account.createToken();
    })
    .then((token) => {
      logger.log('logger.INFO', 'AUTH - returning a 200 code and a token.');
      return response.json({ token });
    })
    .catch(next);
});
```

# Change Log

05-07-2018 10:15pm - POST route established, POST testing complete.