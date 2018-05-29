Lab 19: Authorization - File Management
======


## Feature Tasks  
building a RESTful HTTP server with basic authentication using express.

#### Account
Create a user `Account` model that keeps track of a username, email, hashed password, and token seed. The model should be able to regenerate tokens using json web token. 

#### Server Endpoints
* `POST /signup` 
  * pass data as stringifed JSON in the body of a **POST** request to create a new account
  * on success respond with a 200 status code and an authentication token
  * on failure due to a bad request send a 400 status code

## Tests
200, 400, and 401 OR 404 tests for /login (Auth router)
200, 400, and 401 OR 404 tests for POST /<resource-name>
200 for GET /<resource-name>/:id


