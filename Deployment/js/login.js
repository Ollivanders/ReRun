$(document).ready(function () { // displays all current events when page fully loaded due to .read()
    alert("Please login to gain administrative access");
});
$("#loginButton").click(function () {
    login($('#username').val(), $('#password').val());
});

function login(username, password) {
    $.post("/events2017/login", {username: username, password: password}, function () {
        var auth_token = $.cookie('DurhamEventsAuthToken');

        $.get("/events2017/authenticate", {auth_token: auth_token}, function (data) {
            var status = data.status;
            if (status === "true") {
                window.location.href = "http://127.0.0.1:8090/events2017/admin.html";
            }
            else {
                alertBox();
            }
        });
    });
}

function alertBox() {
    alert("You entry was incorrect, please try again");
}

