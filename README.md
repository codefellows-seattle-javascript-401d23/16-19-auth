## Basic Auth

author: Josiah Green
version: 1.0.0;

## Overview

This program creates an account and saves it's users password securely, and sends a token for the client to access all of their data.

## Getting Started

To start server please verify that you have installed mongoDB and mongoose then run the following code in your command line `npm run dbon`. 

This will allow us to connect to our MongoDB (process.env.MONGODB_URI).  Mongoose acts as the middleware that connects us from our computer to the MongoDB. 

## Paths

##### authRouter.post()

authRouter.post() sends a request to create a new account to the server. This process requires a password, unique username, and a unique email address, upon success the server will return a 200 success message. If there is faulty data entered then server will display a 400 error and error message will read 'Responding with a 400 error code.' If the new data is posted with duplicate data to another account, the server will display a 409 error for a duplicate key.

##### authRouter.get()

authRouter.get() sends a request to access a previously existing account when the user enters the basic authorization credentials. This process requires the same password, username, and email address in order to retrieve the profile successfully. Upon success the server will return a 200 success message. If there is faulty data entered then server will display a 400 error and error message will read 'Responding with a 400 error code.

##### profileRouter.post()

profileRouter.post() sends a request to create a new profile to the server. Upon success the server will return a 200 success message. If there is faulty data entered then server will display a 400 error and error message will read 'Responding with a 400 error code.' 

##### profileRouter.get()

profileRouter.get() sends a request to retrieve a profile from the server. Upon success the server will return a 200 success message. If there is faulty data entered then server will display a 400 error and error message will read 'Responding with a 400 error code.' If no profile can be located then the server will display a 404 error message. 
