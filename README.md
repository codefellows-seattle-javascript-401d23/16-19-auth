# Lab 17: Bearer auth 

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective was to create a POST route with basic auth by taking in a mock password, generating a token and passing a json web token via the post route and receiving a 200 status confirmation that the token was successfully passed.  Then, we process a GET request utilizing Bearer Auth to create a jsonWebToken which is passed as part of the http request.

##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The main entry point of the code is the index.js.  The project also includes several developer dependencies listed in the package.json.
- The test model is based on a mock account module.

# Server.js
- Before starting the server you must launch MongoDB by entering npm run dbon (this script can be found in the package.json)
- The current build is simply a test environment but you can see the functionality by reading the log messages which store in a log.log file and also print to the console when you run jest.
 
### Server Endpoints
There are three server endpoints comprised of a POST .  
* `POST /api/login`
  * the POST route takes in a stringified JSON web token which is carried by a request to create a new resource on the database.
*`GET /api/login`
  * the GET route for login returns a 200 status on successful completion of a token being passed to the client.
* `POST /api/songs`
  * the POST route on songs posts a song to the database and reponds with a 200 on success.
* `GET /api/songs`
  * the GET route on songs verifies that the users account exists and returns a song object to the client.

##Change Log
- 05-08-2018 1:30pm - 2:00pm - Began work on project
- 05-08-2018 4:00pm - 7:30pm - Standing up files and getting base tests to pass
- 05-08-2018 8:30pm - 12:10am - unit testing and debugging 
- 05-09-2018 12:10am - 12:15am - documentation

##Credits and Collaborations
- Thanks Vinicio Sanchez for demo code and Seth Donohue for help with the GET route test.