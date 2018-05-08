# Lab 16 - Basic Authentication
**Author**: Carl Olson
**Version**: 1.0.0

## Overview
This lab project involved building a RESTful HTTP server with basic authentication using express. This is the first in a series of labs that will build on each other. For this one, POST is the only request method being utilized. Mongoose and MongoDB are used for the Schema and database. With authentication being the focus, we used bcrypt for a password hashing algorithm. Crypto, which is built into express, is used to create the token seed. And json web token is used to generate the token. 

## Testing
To start the server for testing, enter in the command line: ```npm run dbon```. Then to start the test, enter: ```npm run test```. To turn the server off, enter: ```npm run dboff```.

A successful status code of 200 is sent as the response if an account and token are created with the data sent in the POST request. If necessary data is not included in the request, a 400 status code will be sent in response. And if the request includes data that attemps to use a duplicate key (email and username must be unique), a 409 code is sent in response. 