// server.js
// the simplest of maven servers
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const Dropbox = require('dropbox');

const app = express();
const dbx = new Dropbox({accessToken: process.env.DROPBOX_ACCESS_TOKEN});

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        if (username === 'admin' && password === process.env.PASSWORD) {
            return cb(null, 'admin');
        } else {
            return cb(null, false);
        }
    }
));

//get bodies as buffers for octet-stream (wat)
app.use(bodyParser.raw());

app.get("/", function (request, response) {
    response.status(200).send("Check out <a href=\"https://github.com/Commit451/fetch\">https://github.com/Commit451/fetch</a> to get started")
});

app.get("/view*", passport.authenticate('basic', {session: false}), function (request, response) {
    let path = request.originalUrl;
    path = path.replace("view", "maven");
    console.log("Got a GET view request: " + path);
    dbx.filesListFolder({path: path})
        .then(function(res) {
            console.log(res);
            response.status(200).send(res);
        })
        .catch(function(error) {
            console.error(error);
            response.status(404).send();
        });
});

//they request the file, we send it
app.get("/maven*", passport.authenticate('basic', {session: false}), function (request, response) {
    const path = request.originalUrl;
    console.log("Got a GET request: " + path);
    dbx.filesDownload({path: path})
        .then(function (dbResponse) {
            console.log(dbResponse);
            response.status(200).send(dbResponse.fileBinary);
        })
        .catch(function (error) {
            console.error(error);
            response.status(404).send(null);
        });
});

//they send the file, we store it
app.put("/maven*", passport.authenticate('basic', {session: false}), function (request, response) {
    const path = request.originalUrl;
    console.log("Got a PUT request: " + path);

    const buffer = request.body;

    dbx.filesUpload({path: path, contents: buffer, mode: 'overwrite'})
        .then(function (dbResponse) {
            response.sendStatus(200);
            console.log(dbResponse);
        })
        .catch(function (error) {
            console.error(error);
            response.sendStatus(500);
        });

});

// listen for requests :)
const server = app.listen(process.env.PORT || '8080', function () {
    console.log('Your app is listening on port ' + server.address().port);
});

//for the tests!
module.exports = server;
