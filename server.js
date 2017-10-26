// server.js
// the simplest of maven servers
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const Message = require('./Message');
const firebase = require("firebase");
require("firebase/firestore");

const app = express();

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);

// Get a reference to the database service
const db = firebase.firestore();

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(
    function (username, password, cb) {

        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
        });
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
    const body = new Message("Take a look at https://github.com/Commit451/fetch");
    response.status(200).send(body)
});

app.get("/view*", passport.authenticate('basic', {session: false}), function (request, response) {
    let path = request.originalUrl;
    path = path.replace("view", "maven");
    console.log("Got a GET view request: " + path);
    // dbx.filesListFolder({path: path})
    //     .then(function(res) {
    //         console.log(res);
    //         const filesAndFolders = [];
    //         res.entries.forEach(function(entry) {
    //             let fileOrFolder = {};
    //             fileOrFolder['type'] = entry['.tag'];
    //             fileOrFolder['name'] = entry['name'];
    //             filesAndFolders.push(fileOrFolder);
    //         });
    //         response.status(200).send(filesAndFolders);
    //     })
    //     .catch(function(error) {
    //         console.error(error);
    //         send404(response)
    //     });
});

//they request the file, we send it
app.get("/maven*", passport.authenticate('basic', {session: false}), function (request, response) {
    const path = request.originalUrl;
    console.log("Got a GET request: " + path);
    // dbx.filesDownload({path: path})
    //     .then(function (dbResponse) {
    //         console.log(dbResponse);
    //         response.status(200).send(dbResponse.fileBinary);
    //     })
    //     .catch(function (error) {
    //         console.error(error);
    //         send404(response)
    //     });
});

//they send the file, we store it
app.put("/maven*", passport.authenticate('basic', {session: false}), function (request, response) {
    const path = request.originalUrl;
    console.log("Got a PUT request: " + path);

    const buffer = request.body;

    // dbx.filesUpload({path: path, contents: buffer, mode: 'overwrite'})
    //     .then(function (dbResponse) {
    //         const body = {};
    //         body['message'] = "Uploaded";
    //         response.sendStatus(200);
    //         console.log(dbResponse);
    //     })
    //     .catch(function (error) {
    //         console.error(error);
    //         send500(response)
    //     });

    //upload the file
});

// listen for requests :)
const server = app.listen(process.env.PORT || '8080', function () {
    console.log('Your app is listening on port ' + server.address().port);
});

function send404(response) {
    const errorBody = new Message("Not found");
    response.status(404).send(errorBody);
}

function send500(response) {
    const errorBody = new Message("Server error");
    response.status(500).send(errorBody);
}

//for the tests!
module.exports = server;
