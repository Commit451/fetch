// server.js
// the simplest of maven servers

var express = require('express');
var fs = require('fs');
var path = require('path')
var getSize = require('get-folder-size');
var app = express();

//doesn't get copied between remixes https://glitch.com/faq/
var folder = ".data";

app.get("/", function (request, response) {
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

//they request the file, we send it
app.get("*", function (request, response) {
  var path = request.originalUrl;
  console.log("Got a GET request:" + path);
  if (fs.existsSync(folder + path)) {
    console.log("Found! Sending...")
    response.sendFile(folder + path, { root: __dirname })
  } else {
    console.log("Not found. Sending null")
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