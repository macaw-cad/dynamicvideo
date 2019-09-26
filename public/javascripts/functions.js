
var xhttp = new XMLHttpRequest();

xhttp.open("POST", "/api/v1/send-answer", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("fname=Henry&lname=Ford");