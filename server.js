// server.js
// the simplest of maven servers
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const Message = require('./Message');

const admin = require("firebase-admin");

const serviceAccount = require(__dirname + "/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fetch-dat.firebaseio.com"
});

const db = admin.firestore();
const usersRef = db.collection("users");

const app = express();

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        console.log("challenge");
        usersRef.where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.docs.length === 0) {
                    console.log("no user found");
                    return cb(null, false);
                } else {
                    const doc = snapshot.docs[0];
                    let usersPassword = doc.data()['password'];
                    console.log("Password: " + usersPassword);
                    if (password === usersPassword) {
                        console.log("user is authorized");
                        return cb(null, 'admin');
                    } else {
                        return cb(null, false);
                    }
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
                return cb(null, false);
            });
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
    const body = new Message("Take a look at https://github.com/Commit451/fetch");
    response.status(200).send(body)
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
