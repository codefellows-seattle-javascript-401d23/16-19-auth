Lab 16: Basic Authentication
======

## Feature Tasks  
building a RESTful HTTP server with basic authentication using express

## `Account`
Creates a user Account model that keeps track of a username, email, hashed password, and token seed. The model regenerates tokens using json web token.

## Server Endpoints
* `POST /signup` 
  * passes data as stringifed JSON in the body of a **POST** request to create a new account
  * on success responds with a 200 status code and an authentication token
  * on failure due to a bad request sends a 400 status code

## Tests
* POST tests for 200, 400, and 409 (if any keys are unique)

## To run project
add the following to package.json
```{
     "name": "16-19-auth",
     "version": "1.0.0",
     "description": "![cf](https://i.imgur.com/7v5ASc8.png) Lab 16: Basic Authentication ======",
     "main": "index.js",
     "scripts": {
       "test-nolint": "jest --coverage --forceExit --runInBand",
       "test": "eslint . && jest --coverage --forceExit --runInBand",
       "dbon": "mkdir -p ./db && mongod --dbpath ./db",
       "dboff": "killall mongod"
     },
     "jest": {
       "setupFiles": [
         "<rootDir>/src/__test__/lib/test.env.js"
       ]
     },
     "repository": {
       "type": "git",
       "url": ""
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "homepage": "",
     "devDependencies": {
       "babel": "^6.23.0",
       "babel-eslint": "^8.2.3",
       "babel-preset-env": "^1.6.1",
       "babel-register": "^6.26.0",
       "eslint": "^4.19.1",
       "eslint-config-airbnb-base": "^12.1.0",
       "eslint-plugin-import": "^2.11.0",
       "eslint-plugin-jest": "^21.15.1",
       "jest": "^22.4.3",
       "superagent": "^3.8.3"
     },
     "dependencies": {
       "bcrypt": "^2.0.1",
       "body-parser": "^1.18.2",
       "dotenv": "^5.0.1",
       "express": "^4.16.3",
       "faker": "^4.1.0",
       "http-errors": "^1.6.3",
       "init": "^0.1.2",
       "jsonwebtoken": "^8.2.1",
       "mongoose": "^5.0.17",
       "winston": "^3.0.0-rc5"
     }
   }
```
Open two terminals
In terminal 1 enter:
npm run dbon
    (this starts Mongodb)

In other CLI enter:
npm init -y
npm i
npm run test
    (script setup in .json to runs tests)




