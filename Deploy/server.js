const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path");
const request = require("request");
const rp = require('request-promise');
const moment = require('moment');

const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const key = "2387562BatmanIsBruceWayne";

users = [ // located at base/auth, check questions and chat
    {
        "user": "1",
        "username": "JohnWick",
        "password": "youkilledmydog",
    },
    {
        "user": "2",
        "username": "PeterParker",
        "password": "Is Spiderman",
    },
    {
        "user": "3",
        "username": "oli876",
        "password": "pi314159",
    },
]; // list of user objects with each specifing a username and password

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', true);
app.use(express.static(__dirname));

app.get('/Deploy/maps.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/maps.html'));
});


app.listen(8090);
console.log("Dark magic is taking place on port: " + 8090);
