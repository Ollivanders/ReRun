$(document).ready(function () {
    load();
});

function load() {
    $.ajax({
        url: 'https://image.maps.api.here.com/mia/1.6/mapview',
        type: 'GET',
        data: {
            app_id: 'QiFKebd8bcnRbZGEcwld',
            app_code: 'ze8W4nLeImVYnd5skk6xJw'
        },
        success: function (data) {
            alert(JSON.stringify(data));
        }
    });
}