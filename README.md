Lab 16: Basic Authentication

**Author:** Jennifer Piper


## Getting Started
In a node.js environment, from the root of this repo, install dependencies:
* `npm i`

Start the database server: 
* `npm run dbon`

And run automated tests (this starts the Node server before the tests, and stops it after the tests):
* `npm run test`

To turn off the database server: 
* `npm run dboff`

To turn on the server for manual testing (make sure this is off if running automated tests), make sure there is a PORT specified in the environment variables (for example: `PORT=3000`), then: 
* `npm start`

## API Endpoints

```
POST /signup
```

Pass data as stringifed JSON in the body of a POST request to create a new account. For example:
```
echo '{"username":"foo","password":"bar","email":"baz@baz.com"}' | http POST http://localhost:3000/signup
```
On success, if the username is unique, the server will return a 200 status code and a token. If this username has been used before, it will return a 409 code.
On failure due to a bad request it will return a 400 status code.
