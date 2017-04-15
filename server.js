// server.js
// where your node app starts

// init project
var express = require('express');
var fs = require('fs');
var path = require('path')
var app = express();

//doesn't get copied between remixes
var folder = ".data";

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

//it all goes here
app.get("*", function (request, response) {
  var path = folder + request.originalUrl;
  console.log("Got a GET request:" + path);
  if (fs.existsSync(path)) {
    fs.readFile(path, 'utf8', function (err,data) {
      if (err) {
        //204, assume the thing doesn't exist
        response.sendStatus(400);
        console.log(err);
      } else {
        console.log("Sending data:")
        console.log(data);
        response.status(200).send(data)
      }
    });
  } else {
    response.send(null);
  }
  
});

//they send the file, we store it
app.put("*", function (request, response) {
  var path = folder + request.originalUrl;
  console.log("Got a PUT request: " + path)
  ensureDirectoryExistence(path);
  fs.writeFile(path, request.body, function(err) {
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      console.log("The file was saved!");
      response.sendStatus(200);
    }
  }); 
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
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