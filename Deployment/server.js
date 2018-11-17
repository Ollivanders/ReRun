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
var venues = {};
var events = [];

app.use(express.static(__dirname));

fs.readdir("./venues", function (err, files) {
    if (err) res.status(400).send();
    fs.readFile("./venues/venues.json", function (err, data) {
        if (err) res.status(400).send();
        var venueObject = JSON.parse(data);
        venues = venueObject.venues;
    });
});

fs.readdir("./events", function (err, files) {
    if (err) res.status(400).send();
    fs.readFile("./events/events.json", function (err, data) {
        if (err) res.status(400).send();
        var eventsObject = JSON.parse(data);
        events = eventsObject.events;
    });
});

app.get('/events2017/index.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/events2017', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/events2017/admin.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/admin.html'));
});

app.get('/events2017/login.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/events2017/venues', function (req, res) {
    res.header("Content-type", "application/json");
    var venuesObject = {"venues": venues};
    res.status(200).send(JSON.stringify(venuesObject)); // send the master object as JSON
});

app.get("/events2017/events/search", function (req, res) { // need to add search elements in
    res.header("Content-type", "application/json");
    var useExternal = true; // used to hard code whether external events are displayed
    var titleDefined = false;
    var dateDefined = false;
    if ((req.query.search !== undefined) && (req.query.search !== "")) {
        var title = req.query.search;
        titleDefined = true;
    }
    if (req.query.date !== undefined && (req.query.date !== "")) {
        var date = req.query.date;
        dateDefined = true;
    }
    if (useExternal) {
        var returnedEvents = {events: [], external: []};
    }
    else {
        var returnedEvents = {events: []};
        if (events.length === 0) {
            res.status(200).send(JSON.stringify(returnedEvents));
        }
    }

    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (titleDefined && dateDefined) {
            if (event.title.toString().toLowerCase().includes(title.toLowerCase()) && event.date.includes(date)) { // date should match, title contains search term
                returnedEvents.events.push(event);
            }
        }
        else if (dateDefined) {
            if (event.date.includes(date)) { // date should match, title contains search term
                returnedEvents.events.push(event);
            }
        }
        else if (titleDefined) {

            //var test = event.title.toString().toLowerCase();
            if (event.title.toString().toLowerCase().includes(title.toLowerCase())) { // date should match, title contains search term
                returnedEvents.events.push(event);
            }
        }
        else if (!(titleDefined && dateDefined)) {
            returnedEvents.events.push(event);
        }
        if ((i === events.length - 1) && !useExternal) {
            res.status(200).send(JSON.stringify(returnedEvents));
        }
    }
    if (useExternal) {
        var options = {
            method: "GET",
            url: "http://api.eventful.com/json/events/search",
            qs: {
                app_key: "D4P49zWLcrGSgcQS",
                keywords: "Christmas",
                location: "United Kingdom",
                date: "Future"
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        rp(options)
            .then(function (data) {
                var eventsExternal = JSON.parse(data);
                var numberOfEvents = eventsExternal.events.event.length;
                for (var i = 0; i < numberOfEvents; i++) {
                    var event = eventsExternal.events.event[i];
                    if (titleDefined && dateDefined) {
                        if (event.title.toString().toLowerCase().includes(title.toLowerCase()) && event.start_time.includes(date)) { // date should match, title contains search term
                            returnedEvents.external.push(event);
                        }
                    }
                    else if (dateDefined) {
                        if (event.start_time.includes(date)) { // date should match, title contains search term
                            returnedEvents.external.push(event);
                        }
                    }
                    else if (titleDefined) {
                        //var test = event.title.toString().toLowerCase();
                        var eventTitle = event.title;
                        if (event.title.toString().toLowerCase().includes(title.toLowerCase())) { // date should match, title contains search term
                            returnedEvents.external.push(event);
                        }
                    }
                    else if (!(titleDefined && dateDefined)) {
                        returnedEvents.external.push(event);
                    }
                    if (i === numberOfEvents - 1) {
                        res.status(200).send(JSON.stringify(returnedEvents)); // will need to do this on to multiple lines
                    }
                }
                console.log("event search requested")
            })
            .catch(function (err) {
                console.log(err);
            });
    }
});

app.get("/events2017/events/get/:event_id", function (req, res) { //-->  /events/get/e_1
    res.header("Content-type", "application/json");
    var event_id = req.params.event_id.toString();
    var value = {
        error: "no such event"
    };
    fs.readdir("./events", function (err, files) {
        if (err) res.status(400).send();
        fs.readFile("./events/events.json", function (err, data) {
            var eventFound = false;
            if (events.length === 0) {
                res.status(400).send(JSON.stringify(value));
            }
            else {
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (event.event_id.includes(event_id)) {
                        value = event;
                        eventFound = true;
                        res.status(200).send(JSON.stringify(value));
                    }
                }
                if (!eventFound) {
                    res.status(400).send(JSON.stringify(value));
                }
            }
        });
    });
});

app.post("/events2017/venues/add", function (req, res) {  // authentication token needed this is going to be a parameter
    res.header("Content-type", "application/json");
    var auth_token = req.body.auth_token;
    request({
        url: req.protocol + '://' + req.get('host') + '/events2017/authenticate',
        qs: {
            auth_token: auth_token,
            ipAddress: req.connection.remoteAddress.replace(/^.*:/, '')
        }
    }, function (error, response, body) {
        var status = JSON.parse(body).status;
        if (status === "true") {
            var name = req.body.name;
            if (name === undefined || name === "") {
                response = {
                    error: "Please specify a name"
                }
                res.status(400).send(response);
            }
            else {
                var postcode = req.body.postcode;  // optional
                var town = req.body.town;  // optional
                var url = req.body.url;  // optional
                var icon = req.body.icon;  // optional
                var venue = {};
                var id = 1;
                for (var o in venues) {
                    id++;
                }

                // defines default values
                var venue_id = "v_" + id;
                venue.name = name;
                if (postcode === "" || postcode === undefined) {
                    venue.postcode = "Too be announced";
                }
                else {
                    venue.postcode = postcode;
                }
                if (town === "" || town === undefined) {
                    venue.town = "Too be announced";
                }
                else {
                    venue.town = town;
                }
                if (url === "" || url === undefined) {
                    venue.url = "http://google.com";

                }
                else {
                    venue.url = url;
                }
                if (icon === "" || icon === undefined) {
                    venue.icon = "http://www.visitcayucosca.com/wp-content/uploads/Christmas-decorations-1355776758_831.jpg";
                }
                else {
                    venue.icon = icon;
                }
                venues[venue_id] = venue;
                response = {
                    success: "venue added."
                }
                res.status(200).send(response);
            }
        }
        else {
            res.status(400).send({
                "error": "not authorised, wrong token"
            })
        }
    });
}); // response should be 400 or 200 respectively at the end, if fails etc.

app.post("/events2017/events/add", function (req, res) {  // authentication token needed this is going to be a parameter
    res.header("Content-type", "application/json");
    var auth_token = req.body.auth_token;
    request({
        url: req.protocol + '://' + req.get('host') + '/events2017/authenticate',
        qs: {
            auth_token: auth_token,
            ipAddress: req.connection.remoteAddress.replace(/^.*:/, '')
        }
    }, function (error, response, body) {
        var status = JSON.parse(body).status;
        if (status === "true") {

            var date = req.body.date;
            var truth = moment(date, moment.ISO_8601, false).isValid();
            if (date === "" || date === undefined || !moment(date, moment.ISO_8601, true).isValid()) {
                response = {
                    error: "Please specify a valid date in ISO_8601 format"
                }
                res.status(400).send(response);
            }
            else {
                var event_id = req.body.event_id;
                if (event_id === "" || event_id === undefined) {
                    response = {
                        error: "Please specify an event_id"
                    }
                    res.status(400).send(response);
                }
                else {
                    var title = req.body.title;
                    if (title === "" || title === undefined) {
                        response = {
                            error: "Please specify a title"
                        }
                        res.status(400).send(response);
                    }
                    else {
                        var venue_id = req.body.venue_id;
                        if (venue_id === "" || venues[venue_id] === undefined) {
                            response = {
                                error: "Please specify a correct venue_id"
                            }
                            res.status(400).send(response);
                        }
                        else {
                            var url = req.body.url;
                            var blurb = req.body.blurb;

                            var event = {};
                            event.event_id = event_id;
                            var deleteValue = -1; // index of event_id already in the array
                            for (var i = 0; i < events.length; i++) {
                                if (events[i].event_id.includes(event_id)) {
                                    deleteValue = i;
                                }
                            }
                            if (deleteValue > -1) {
                                events.splice(deleteValue, 1);
                            }

                            event.date = date;
                            event.title = title;
                            event.event_id = event_id;

                            if (blurb === "" || blurb === undefined) {
                                event.blurb = "To be announced";
                            }
                            else {
                                event.blurb = blurb;
                            }
                            if (url === "" || url === undefined) {
                                event.url = "http://google.com"
                            }
                            else {
                                event.url = url;
                            }
                            event.venue = venues[venue_id];
                            event.venue.venue_id = venue_id;
                            events.push(event);
                            response = {
                                success: "event added."
                            }
                            res.status(200).send(response);
                        }
                    }
                }
            }
        }
        else {
            res.status(400).send({
                "error": "not authorised, wrong token"
            })
        }
    });
});

app.post('/events2017/login', function (req, res) { // needs to issue an authentication token
    res.header("Content-type", "application/json");
    const username = req.body.username;
    const password = req.body.password;
    const ipAddress = req.connection.remoteAddress.replace(/^.*:/, '');

    var tokenMade = false;
    var privateKey = key + ipAddress;
    var auth_token = {
        "error": "not authorised, incorrect username or password"
    };
    // ip address req.connection.remoteAddress
    for (var i = 0; (i < users.length) && !tokenMade; i++) {
        if (users[i].username === username && users[i].password === password) {
            auth_token = jwt.sign("auth_token", privateKey);
            res.cookie('DurhamEventsAuthToken', auth_token, {maxAge: 2 * 60 * 60 * 1000});
            tokenMade = true;
            res.status(200).send(JSON.stringify(auth_token));
            console.log("cookie given");
        }
    }
    if (!tokenMade) {
        res.status(200).send(JSON.stringify(auth_token));
    }
});

app.get('/events2017/authenticate', function (req, res) { // takes an authentication token and ip address, returns whether token is valid
    res.header("Content-type", "application/json");
    if (req.query.ipAddress === undefined) {
        var ipAddressClient = req.connection.remoteAddress.replace(/^.*:/, '');
    }
    else {
        var ipAddressClient = req.query.ipAddress;
    }
    var auth_token = req.query.auth_token;

    if (auth_token === "concertina" && ipAddressClient.slice(0, 7) === ("129.234")) {
        return res.json({status: "true"});
        console.log("login successful");
    }
    else {
        var privateKey = key + ipAddressClient;
        var verifiedToken = jwt.verify(auth_token, privateKey, function (err) {
            if (err) {
                return res.send(JSON.stringify({status: "false"}));
            } else {
                return res.send(JSON.stringify({status: "true"}));
                console.log("login successful");
            }
        });
    }
}); // return true or false, map to url

app.listen(8090);
console.log("Dark magic is taking place on port: " + 8090);
