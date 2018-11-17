$(document).ready(function () { // displays all current events when page fully loaded due to .read()
    load("", "");
});

$("#searchButton").click(function () {
    load($('#search').val(), $('#date').val());
});

$("#loginButton").click(function () {
    login($('#username').val(), $('#password').val());
});

function load(title, date) { // load events that meet the criteria
    $.get("/events2017/events/search", {search: title, date: date}, function (data) {

        $("#tiles")[0].innerHTML = "";
        for (var i in data.events) { // loops throgh all the events and adds them to allEvents which is returned
            var allEvents = [
                '<div class="card" style="width: 20rem; margin:2rem">',

                '<img class="card-img-top" src="' + data.events[i].venue.icon + '"alt ="Card image cap">',
                '<div class="card-block">',
                '<h4 class="card-title">' + data.events[i].title + '</h4>',
                '<p class="card-text">' + new Date(data.events[i].date) + '</p>',
                '</div>',
                '<div class="panel-group">',
                '<div class="panel panel-default">',
                '<div class="panel-heading">',
                '<h4 class="panel-title">',
                '<a data-toggle="collapse" href="#' + data.events[i].event_id + '">' + data.events[i].venue.name + '</a>',
                '</h4>',
                '<div id="' + data.events[i].event_id + '" class="panel-collapse collapse">',
                '<div class="panel-body">' + data.events[i].blurb + '</div>',
                '<div class="panel-body">Venue '+ data.events[i].venue.venue_id + ': ' + data.events[i].venue.name + '</div>',
                '<div class="panel-body">Postcode: ' + data.events[i].venue.postcode + '</div>',
                '<div class="panel-body">Town: ' + data.events[i].venue.town + '</div>',
                '<a href="' + data.events[i].venue.url + '" class="card-link">The Venue</a>',
                '<a href="' + data.events[i].url + '" class="card-link">Find out More</a>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'].join("\n");
            $('#tiles').append(allEvents)
        }

        $("#tilesExternal")[0].innerHTML = "";
        for (var i in data.external) { // loops through all the events and adds them to allEvents which is returned
            var allExternalEvents = [
                '<div class="card" style="width: 20rem; margin:2rem">',

                '<div class="card-block">',
                '<h4 class="card-title">' + data.external[i].title + '</h4>',
                '<p class="card-text">' + data.external[i].start_time + '</p>',
                '</div>',
                '<div class="panel-group">',
                '<div class="panel panel-default">',
                '<div class="panel-heading">',
                '<h4 class="panel-title">',
                '<a data-toggle="collapse" href="#' + data.external[i].id + '">' + data.external[i].venue_name + '</a>',
                '</h4>',
                '<div id="' + data.external[i].id + '" class="panel-collapse collapse">',
                '<div class="panel-body">' + data.external[i].venue_name + '</div>',
                //'<div class="panel-body">' + data.external[i].venue_postcode + '</div>',
                '<div class="panel-body">' + data.external[i].venue_address + '</div>',
                '<a href="' + data.external[i].venue_url + '" class="card-link">The Venue</a>',
                '<a href="' + data.external[i].url + '" class="card-link">Find out More</a>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'].join("\n");
            $('#tilesExternal').append(allExternalEvents)
        }
    });
}

function login(username, password) {
    $.post("/events2017/login", {username: username, password: password}, function () {
        var auth_token = $.cookie('DurhamEventsAuthToken');

        $.get("/events2017/authenticate", {auth_token: auth_token}, function (data) {
            var status = data.status;
            if (status === "true") {
                window.location.href = "http://127.0.0.1:8090/events2017/admin.html";
            }
            else {
                window.location.href = "http://127.0.0.1:8090/events2017/login.html";
            }
        });
    });
}

function alertBox() {
    alert("You entry was incorrect, please try again");
}
