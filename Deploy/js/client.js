$(document).ready(function () { // displays all current events when page fully loaded due to .read()
    load();
});


function load() { // load events that meet the criteria
    $.get("https://image.maps.api.here.com/mia/1.6/mapview?app_id=QiFKebd8bcnRbZGEcwld&app_code=ze8W4nLeImVYnd5skk6xJw", function (data) {

        $('.div_imagetranscrits').html('<img src="data:image/png;base64,' + data + '" />');
    });
}