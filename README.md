# Lab 19: Asset Management 

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective was to create a POST route with basic auth by taking in a mock password, generating a token and passing a json web token via the post route and receiving a 200 status confirmation that the token was successfully passed.  Then, we process a GET request utilizing Bearer Auth to create a jsonWebToken which is passed as part of the http request.

##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The main entry point of the code is the index.js.  The project also includes several developer dependencies listed in the package.json.
- The test model is based on three mocks, the account mock which provides a mock of an account which is required in order to access the song and image mocks.

## Image Model
- The Image model consists of an image schema with four properties
    - artist: is required and denotes the name of the artist who is denoted in the image.  In future versions of this project it will connect to the song.js model.
    - url: is required and holds a url to the stored object on an Amazon S3 bucket.
    - genre:  while not required, will in future versions hold a genre for the artist.
    - camera: also not a required property but can contain information about the equipment used to shoot the image.

# Server.js
- Before starting the server you must launch MongoDB by entering npm run dbon in you command line interface (this script can be found in the package.json)
- The current build is simply a test environment but you can see the functionality by reading the log messages which store in a log.log file and also print to the console when you run jest.
 
### Server Endpoints
There are two server endpoints for this current assignment comprised of a POST and a GET.  
* `POST /api/images`
  * the POST route takes in a stringified JSON web token which is carried by a request to create a new resource on the database.
  * upon a successful post to the database, the route returns a status 200 and logs a message that the post was successful.
  * if there is an issue with the post related to the account, for example, if there is no account included in the request, the route will return a status 401.
  * if there is a bad request, for example, if the request does not include all required data like missing field data in the multi-form upload, the server will return a 400 status and an error message. 

*`GET /api/images`
  * the GET route for login returns a 200 status on successful completion of a token being passed to the client and an image returned from the database.


##Change Log
- 05-10-2018 1:30pm - 2:00pm - Began work on project
- 05-10-2018 4:30pm - 7:30pm - TDD/building POST route
- 05-11-2018 4:00pm - 7:30pm - debugging the POST route
- 05-11-2018 9:00pm - 10:30pm - successful the POST route working
- 05-12-2018 8:00am - 10:30pm - unit testing and debugging the POST route
- 05-12-2018 7:00pm - 10:00pm - unit testing and debugging the GET route
- 05-13-2018 08:30am - 9:45am - documentation

##Credits and Collaborations
- Thanks Vinicio Sanchez for demo code and Judy Vue for helping me debug for way longer than expected.  Thank you to Seth Donohue and Joy Hue as well for assistance with helping to get the POST route working.