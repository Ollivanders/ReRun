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
            zoom: 20,
            center: { lat: 40.72487873235667, lng: -73.99684149755325 }
        });

    var distance = 0.05;
    var n_waypoints = 5;
    initial_random_angle = 2*Math.PI*Math.random();
    var waypoints = [];
    var waypoint0 = [54.7767600,-1.5756600];
    waypoints.push(waypoint0);
    var previous_waypoint = [waypoint0[0], waypoint0[1]];
    var random_1;
    var random_2;

    for (var i = 1; i < n_waypoints; i++) {
        random_1 = distance * (2* Math.random()-1);
        random_2 = distance * (2* Math.random()-1);
        var long = previous_waypoint[0] + random_1;
        var lat = previous_waypoint[1] + random_2;
        var temp_waypoint = [long, lat];
        waypoints.push(temp_waypoint);
        previous_waypoint = [temp_waypoint[0], temp_waypoint[1]];
    };
    //waypoints.push([waypoint0[0] +0.00000000000001, waypoint0[1] + 0.00000000000001]);

    var routingParameters = {
        'mode': 'balanced;pedestrian',
    };

    for (var i = 0; i < (n_waypoints); i++) {
        var waypointIndex = waypoints[i];
        long = waypointIndex[0];
        lat = waypointIndex[1];
        routingParameters['waypoint' + i] = 'geo!' + long + ',' + lat;
    }

    routingParameters['representation'] = 'display';

// Define a callback function to process the routing response:
    var onResult = function(result) {
        var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
        if(result.response.route) {
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function(point) {
                var parts = point.split(',');
               linestring.pushLatLngAlt(parts[0], parts[1]);
           });

            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            //endPoint = route.waypoint[n_waypoints].mappedPosition;

            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
                style: { strokeColor: 'orange', lineWidth: 10 },
                arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }

            });

            // Create a marker for the start point:
            var startMarker = new H.map.Marker({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            });

            // Create a marker for the end point:
           // var endMarker = new H.map.Marker({
            //    lat: endPoint.latitude,
            //    lng: endPoint.longitude
            //});

            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker]);

            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());

            /*
            $.ajax({
                url : 'https://route.api.here.com/routing/7.2/calculateroute',
                type : 'GET',
                data : {
                    'app_id': 'q68gRNG9rPpTxQaxg1V9',
                    'app_code': '7_c59N78SaUc6fdI4NSR6w',
                    routingParameters
                },
                dataType: 'json',
                //The response from the server
                'success' : function(data) {
                    //You can use any jQuery/JavaScript here!!!
                    if (data == "success") {
                        console.log('yo')
                        var run_length = data.route[0].summary.distance;
                        console.log(run_length)
                    }
                }
            });
*/
        }
    };

    var onResult2 = function(result) {
        var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
        if(result.response.route) {
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function(point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
            });

            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            //endPoint = route.waypoint[n_waypoints].mappedPosition;

            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
                style: { strokeColor: 'red', lineWidth: 10 },
                arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }

            });

            // Create a marker for the start point:
            var startMarker = new H.map.Marker({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            });

            // Create a marker for the end point:
            // var endMarker = new H.map.Marker({
            //    lat: endPoint.latitude,
            //    lng: endPoint.longitude
            //});

            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine]);

            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());

            /*
            $.ajax({
                url : 'https://route.api.here.com/routing/7.2/calculateroute',
                type : 'GET',
                data : {
                    'app_id': 'q68gRNG9rPpTxQaxg1V9',
                    'app_code': '7_c59N78SaUc6fdI4NSR6w',
                    routingParameters
                },
                dataType: 'json',
                //The response from the server
                'success' : function(data) {
                    //You can use any jQuery/JavaScript here!!!
                    if (data == "success") {
                        console.log('yo')
                        var run_length = data.route[0].summary.distance;
                        console.log(run_length)
                    }
                }
            });
*/
        }
    };

    var routeBackParameters = {
        'mode': 'balanced;pedestrian',
    };

    routeBackParameters['waypoint0'] = 'geo!' + waypoints[n_waypoints-1][0] + ',' + waypoints[n_waypoints-1][1];
    routeBackParameters['waypoint1'] = 'geo!' + waypoints[0][0] + ',' + waypoints[0][1];

    routeBackParameters['representation'] = 'display';

// Get an instance of the routing service:
    var router = platform.getRoutingService();

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
    router.calculateRoute(routingParameters, onResult,
        function(error) {
            alert(error.message);
        });

    router.calculateRoute(routeBackParameters, onResult2,
       function(error) {
            alert(error.message);
       });
}
