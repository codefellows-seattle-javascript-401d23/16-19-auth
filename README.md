# Lab 16: Basic auth 

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective was to create a POST route with basic auth by taking in a mock password, generating a token and passing a json web token via the post route and receiving a 200 status confirmation that the token was successfully passed.

##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The main entry point of the code is the index.js.  The project also includes several developer dependencies listed in the package.json.
- The test model is based on a mock account module.

# Server.js
- Before starting the server you must launch MongoDB by entering npm run dbon (this script can be found in the package.json)
- The current build is simply a test environment but you can see the functionality by reading the log messages which store in a log.log file and also print to the console when you run jest.
 
### Server Endpoints
There is one server endpoint comprised of a POST .  
* `POST /api/signup`
  * the POST route takes in a stringified JSON web token which is carried by a request to create a new resource on the database.

##Change Log
- 05-07-2018 4:00pm - 6:00pm - Began work on project
- 05-02-2018 8:00pm - 10:00pm - unit testing and debugging 
- 05-02-2018 8:15am - 8:45am - passing post 200 test and documentation

##Credits and Collaborations
- Thanks Vinicio Sanchez for demo code and Josh Fredrickson for help finding a sneaky bug