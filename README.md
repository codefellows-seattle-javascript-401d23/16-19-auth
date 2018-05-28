# Lab 20: Deployment 

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective of this project was to learn how to deploy one of our recent backend projects into a production setting using Travis Continuous Integration, Heroku and Mlab for MondoDB.  In order to meet the requirements, we need a project that passed all tests in order to pass Travis continuous integration.  We also needed to learn about heroku app, how to store API keys, and link travis to heroku.  We also needed to learn how to connect mLab as a resource to the heroku repo in order to our mongodb to function in production.  Additionally, we need to set up our development project to build a production version of our code that will be able to run in production.  This involves using babel-cli and babel-preset-stage-0 in order to transpile out ES6, 7 and 8 javascript into ES 5 so that it can nbe run in all browsers.


##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The main entry point of the code is the index.js.  The project also includes several developer dependencies listed in the package.json.
- The test model is based on three mocks, the account mock which provides a mock of an account which is required in order to access the song and image mocks.


# Server.js
- You can access the server endpoints at: https://lab-20-deployment.herokuapp.com/
 
##Change Log
- 05-10-2018 1:30pm - 2:00pm - Began work on project
- 05-10-2018 4:30pm - 7:30pm - TDD/building POST route
- 05-11-2018 4:00pm - 7:30pm - debugging the POST route
- 05-11-2018 9:00pm - 10:30pm - successful the POST route working
- 05-12-2018 8:00am - 10:30pm - unit testing and debugging the POST route
- 05-12-2018 7:00pm - 10:00pm - unit testing and debugging the GET route
- 05-13-2018 08:30am - 9:45am - documentation
- 05-27-2018 10:00am - 3:00pm - Working with the routes to get tests passing.
- 05-27-2018 3:30pm - 5:30pm - Researching heroku, travis and mlab in preparation for deployment
- 05-27-2018 6:00pm - 8:00pm - Deploying the application
- 05-27-2018 8:00pm - 8:30pm - Documentation

##Credits and Collaborations
- Thanks Vinicio Sanchez for demo code and the walkthrough on how to deploy an application.