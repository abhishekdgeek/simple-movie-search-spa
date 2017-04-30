'use strict'
var express = require('express'),
    morgan = require('morgan'),
    app = module.exports = express();

// Simplest logging of requests in console.
app.use(morgan('tiny'));

// Serve static content
app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log('Server started at port 3000! - http://localhost:3000/');
})