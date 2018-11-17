$(document).ready(function () { // displays all current venues when page fully loaded due to .read()
    load();
});

$("#logout").click(function () {
    window.location.href = "http://127.0.0.1:8090/events2017/index.html";
});

$("#addVenue").click(function () {
    addVenue($('#name').val(), $('#postcode').val(), $('#town').val(), $('#urlVenue').val(), $('#icon').val());
});
$("#addEvent").click(function () {
    addEvent($('#event_id').val(), $('#title').val(), $('#venue_id').val(), $('#date').val(), $('#time').val(), $('#urlEvent').val(), $('#blurb').val());
});

function addVenue(name, postcode, town, urlVenue, icon) {
    var auth_token = $.cookie('DurhamEventsAuthToken');
    if (auth_token === undefined) {
        window.location.href = "http://127.0.0.1:8090/events2017/login.html";
    }
    else {
        $.post("/events2017/venues/add", {
            auth_token: auth_token,
            name: name,
            postcode: postcode,
            town: town,
            url: urlVenue,
            icon: icon
        }, function (err) {
            alert("Venue added Successfully");
            window.location.href = "http://127.0.0.1:8090/events2017/admin.html";
        });
    }
}

function addEvent(event_id, title, venue_id, date, time, urlEvent, blurb) {
    var auth_token = $.cookie('DurhamEventsAuthToken');
    if (auth_token === undefined) {
        window.location.href = "http://127.0.0.1:8090/events2017/login.html";
    }
    var dateString = date.toString() + " " + time.toString();
    var dateParse = new Date(dateString);
    var dateISO = dateParse.toISOString()
    $.post("/events2017/events/add", {
        auth_token: auth_token,
        event_id: event_id,
        title: title,
        date: dateISO,
        time: time,
        url: urlEvent,
        blurb: blurb,
        venue_id: venue_id
    }, function (err) {
        alert("Event added Successfully");
        window.location.href = "http://localhost:8090/events2017/admin.html";

    });
}

function load() { // load events that meet the criteria
    $.get("/events2017/venues", function (data) {
        $("#tiles")[0].innerHTML = "";
        for (var id in data.venues) { // loops throgh all the events and adds them to allEvents which is returned
            var allVenues = [
                '<div class="card" style="width: 20rem; margin:2rem">',

                '<img class="card-img-top" src="' + data.venues[id].icon + '"alt ="Card image cap">',
                '<div class="panel-group">',
                '<div class="panel panel-default">',
                '<div class="panel-heading">',
                '<h4 class="panel-title">',
                '<a data-toggle="collapse" href="#' + id + '">' + id + ": " + data.venues[id].name + '</a>',
                '</h4>',
                '<div class="panel-body">' + data.venues[id].postcode + '</div>',
                '<div class="panel-body">' + data.venues[id].town + '</div>',
                '<a href="' + data.venues[id].url + '" class="card-link">The Venue</a>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'].join("\n");
            $('#tiles').append(allVenues)
        }
    });
}

function authenticate() {
    var auth_token = $.cookie('DurhamEventsAuthToken');
    $.get("/events2017/authenticate", {auth_token: auth_token}, function (data) {
        var status = data.status;
        if (status === "true") {
        }
        else {
            window.location.href = "http://127.0.0.1:8090/events2017/login.html";
        }
    });
}
