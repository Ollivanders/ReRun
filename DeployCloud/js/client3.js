$(document).ready(function () { // displays all current events when page fully loaded due to .read()
    render();
});

$("#renderButton").click(function () {
    document.getElementById("mapContainer").innerHTML = "";
    render();
});

$("#addRowButton").click(function () {
    extraRow()
});

function extraRow() { // load events that meet the criteria
    $.get("/events2017/events/search", {search: title, date: date}, function (data) {

        $("#tiles")[0].innerHTML = "";
        for (var i in data.allWaypoints) { // loops throgh all the events and adds them to allEvents which is returned
            var allWaypoints = [
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
                '<div class="panel-body">Venue ' + data.events[i].venue.venue_id + ': ' + data.events[i].venue.name + '</div>',
                '<div class="panel-body">Postcode: ' + data.events[i].venue.postcode + '</div>',
                '<div class="panel-body">Town: ' + data.events[i].venue.town + '</div>',
                '<a href="' + data.events[i].venue.url + '" class="card-link">The Venue</a>',
                '<a href="' + data.events[i].url + '" class="card-link">Find out More</a>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'].join("\n");
            $('#tiles').append(allWaypoints)
        }
    });
};

function render(){
    // Instantiate a map and platform object:
    var platform = new H.service.Platform({
        'app_id': 'q68gRNG9rPpTxQaxg1V9',
        'app_code': '7_c59N78SaUc6fdI4NSR6w'
    });

// Get the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.normal.map,
        {
            zoom: 15,
            center: { lat: 54.7767600, lng: -1.5756600 }
        });

    var routingParams = {
        'mode': 'fastest;pedestrian;',
        'start': 'geo!54.7767600,-1.5756600',
        'range': '2000',
        'rangetype': 'time'
    };

// Define a callback function to process the isoline response.
    var onResult = function(result) {
        var center = new H.geo.Point(
            result.response.center.latitude,
            result.response.center.longitude),
            isolineCoords = result.response.isoline[0].component[0].shape,
            linestring = new H.geo.LineString(),
            isolinePolygon,
            isolineCenter;

        // Add the returned isoline coordinates to a linestring:
        isolineCoords.forEach(function(coords) {
            linestring.pushLatLngAlt.apply(linestring, coords.split(','));
        });

        // Create a polygon and a marker representing the isoline:
        isolinePolygon = new H.map.Polygon(linestring);
        isolineCenter = new H.map.Marker(center);

        // Add the polygon and marker to the map:
        map.addObjects([isolineCenter, isolinePolygon]);

        // Center and zoom the map so that the whole isoline polygon is
        // in the viewport:
        map.setViewBounds(isolinePolygon.getBounds());
    };

// Get an instance of the routing service:
    var router = platform.getRoutingService();

// Call the Routing API to calculate an isoline:
    router.calculateIsoline(
        routingParams,
        onResult,
        function(error) {
            alert(error.message);
        }
    );
}
