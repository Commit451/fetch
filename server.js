// server.js
// the simplest of maven servers

var express = require('express');
const fs = require('fs-extra')
var path = require('path')
var getSize = require('get-folder-size');
var bodyParser = require('body-parser')
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var app = express();

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    if (username == 'admin' && password == process.env.PASSWORD) {
      return cb(null, 'admin');
    } else {
      return cb(null, false);
    }
  }
));

//get bodies as buffers for octet-stream (wat)
app.use(bodyParser.raw());

//doesn't get copied between remixes https://glitch.com/faq/
var folder = ".data";

app.get("/", function (request, response) {
  console.log("Sending default")
  response.status(200).send("Nothing to see here, check out <a href=\"https://github.com/Commit451/fetch\">https://github.com/Commit451/fetch</a> instead")
});

app.get("/data", function (request, response) {
  getSize(folder, function(err, size) {
    if (err) { 
      response.sendStatus(500);
    } else {
      console.log(size)
      response.status(200).send((size / 1024 / 1024).toFixed(2) + ' Mb used')
    }
  });
});

app.post("/nuke", function (request, response) {
    fs.remove(folder, err => {
    if (err) {
      console.error(err)
      response.sendStatus(500);
    }

    console.log('they nuked everything!')
    response.status(200).send("You just nuked all the artifacts")
  })
});

//they request the file, we send it
app.get("/maven*", 
        passport.authenticate('basic', { session: false }),
        function (request, response) {
  var path = request.originalUrl;
  console.log("Got a GET request: " + path);
  
  if (fs.existsSync(folder + path)) {
    console.log("Found! Sending...")
    response.sendFile(folder + path, { root: __dirname })
  } else {
    response.send(null);
  }
  
});

//they send the file, we store it
app.put("/maven*", 
        passport.authenticate('basic', { session: false }),
        function (request, response) {
  var path = folder + request.originalUrl;
  console.log("Got a PUT request: " + path);
  //we have to do some ugly stuff to get the buffer into a file. Brace yourself
  var buffer = request.body;
  ensureDirectoryExistence(path);
  fs.open(path, 'w', function(err, fd) {
    if (err) {
        console.log(err);
        response.sendStatus(500);
    }

    fs.write(fd, buffer, 0, buffer.length, null, function(err) {
        if (err) { 
          throw 'error writing file: ' + err;
        }
        fs.close(fd, function() {
            console.log("The file was written!");
            response.sendStatus(200);
        })
    });
  });
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT || '3000', function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
