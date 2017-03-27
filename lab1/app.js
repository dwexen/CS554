const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const uuid = require('node-uuid');

app.use(bodyParser.json());


var currentNumberOfRequests = 0;
app.use(function(request, response, next) {
    currentNumberOfRequests++;
    console.log("There have now been " + currentNumberOfRequests + " requests made to the website.");
    next();
});

var pathsAccessed = {};
app.use(function(request, response, next) {
    if (!pathsAccessed[request.path]) pathsAccessed[request.path] = 0;

    pathsAccessed[request.path]++;

    console.log("There have now been " + pathsAccessed[request.path] + " requests made to " + request.path);
    next();
});

app.use("/tasks", function(req, response, next) {
    req.requestId = uuid.v4();
    time = new Date().toLocaleString();
    console.log( {
    	"reqId": req.requestId,
    	"reqPath": req.path,
    	"reqMethod": req.method,
    	"time": time
    });
      next()
    });


configRoutes(app);
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});