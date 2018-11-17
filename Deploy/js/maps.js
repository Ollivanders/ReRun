
// Initialize the platform object:
var platform = new H.service.Platform({
    'app_id': '{uQqv268Z7lz5znXmMkzK}',
    'app_code': '{xFJgcPZFajdB7_Fj7bw9yA}'
});

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
    document.getElementById('mapContainer'),
    maptypes.normal.map,
    {
        zoom: 12,
        center: {lng: -1.5849, lat: 54.7753}
    });

