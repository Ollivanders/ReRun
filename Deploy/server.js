const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path");
const request = require("request");
const rp = require('request-promise');
const moment = require('moment');
var cors = require('cors')

const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const key = "2387562BatmanIsBruceWayne";

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', true);
app.use(express.static(__dirname));


app.get('/Deploy/index.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8090);
console.log("Dark magic is taking place on port: " + 8090);
