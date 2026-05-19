// First we need to install express in our project by running npm install express in the terminal
const express = require('express');
const connectDb = require('./config/db');
const envObj = require('./config/env');
const userRoute = require('./routes/user');
const bcrypt = require('bcrypt');
const productRoute = require('./routes/product');
const cors = require('cors');
const todoRoute = require('./routes/todoapp');
const { verifyTransport, sendMail, sendVerificationEmail } = require("./utils/email");


// Then initialize express by calling the express function and storing it in a variable called app
const app = express();
app.use(express.json()) // This line is used to parse the incoming request body as JSON, it allows us to access the data sent in the request body as a JavaScript object in our route handlers.

app.use(cors({
    origin: "http://localhost:5173"
})) // This line is used to enable Cross-Origin Resource Sharing (CORS) for our server, it allows our server to accept requests from different origins (domains) which is important when we are building a frontend application that will consume our API.
const port = envObj.port

app.use("/api/routes", userRoute);
app.use("/api/product", productRoute);
app.use("/api/todo", todoRoute);

// Creating Endpoint to get all products, when we access the /products route in the browser, it will return the product array as a response
// app.get('/products', (req, res) => {
//     res.send(product);
// })



// Now we can create our first route, which is the root route, and it will return a simple message when we access it in the browser
app.get("/", (req, res) => {
    res.send('Hi welcome to express server');
});

connectDb()

verifyTransport();
// sendMail();
// sendVerificationEmail();
// Then we need to listen to a port for our server to run on, we can choose any port number we want, but it's common to use port 3000 for development
app.listen(port, () => {
    console.log(`Hello our server is running on port: ${port}`);

})


// Postman is used for API testing and documentation, it allows us to make different types of requests (GET, POST, PUT, DELETE) to our server and see the response. We can also use it to test our endpoints and make sure they are working correctly.
