# Lab 17 - Bearer Authentication
**Author**: Carl Olson
**Version**: 1.1.0

## Overview
This lab project involved using basic and bearer authentication to create an account, login, and make GET and POST requests to create or find a profile. This is the second in a series of labs that will build on each other. We added a second Schema/model, Profile, which can only be created referencing a valid account. Mongoose and MongoDB are used for the Schemas and database. With authentication being the focus, we used bcrypt for a password hashing algorithm. Crypto, which is built into express, is used to create the token seed. And json web token is used to generate the token. 

## Testing
To start the server for testing, enter in the command line: ```npm run dbon```. Then to start the test, enter: ```npm run test```. To turn the server off, enter: ```npm run dboff```.

#### Account Model
A successful status code of 200 is sent as the response if an account and token are created with the data sent in the POST request. If necessary data is not included in the request, a 400 status code will be sent in response. And if the request includes data that attemps to use a duplicate key (email and username must be unique), a 409 code is sent in response. 

There is also a test for /login with username and password using basic authentication. If successful, a 200 status code is sent in response.

#### Profile Model
The Profile model has a required reference to the Account model, meaning an Account must be created first. A successfully created profile (POST request) will send a 200 status code in response. If the request data is incomplete, a status code of 400 will be send. And using bearer authorization, if a token is not sent, it will register a 401 error code. Similarly for a GET request completing successfully, a 200 status code is sent in response. If the account requested is not valid, a 404 error code is sent. And if a valid token is not sent,it will register a 401 error code.