Lab 19: Authorization and File Management
===

**Author:** Jennifer Piper

This is an application to send media resources to Amazon S3 for storage and retrieve them using a simple API.

## Getting Started
In a node.js environment, from the root of this repo, install dependencies:
* `npm i`

Start the database server: 
* `npm run dbon`

Run tests (this starts the Node server before the tests, and stops it after the tests):
* `npm run test`

To turn off the database server: 
* `npm run dboff`

## API Endpoints

```
POST /media
```

Passes a bearer authentication token in the request to authorize the creation of the media resource.
Passes data as multipart/form-data in the body of a POST request to create a new resource
should include an attached file asset.
On success responds with a 200 status code and a json representation of the resource
On failure due to a bad request send a 400 status code
On failure due to an invalid token, responds with a 401 status code.

## Screenshot of uploaded resource

![](screenShotUploadedResource.png)

