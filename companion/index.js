import * as messaging from "messaging";
import { geolocation } from "geolocation";

function getWeather() {
    geolocation.getCurrentPosition(locationSuccess);
}

function locationSuccess(pos) {
    let apiKey = "499b4f8b067ddc0eac377f41fd5c7a7e";
    let queryParams = `units=imperial&appid=${apiKey}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
    var url = `https://api.openweathermap.org/data/2.5/weather?${queryParams}`;

    fetch(url).then(function (response) {
        response.json().then(function (data) {
            var weather = {
                temperature: parseInt(data["main"]["temp"])
            }
            
            returnWeatherData(weather);
        });
    });
}

// Send the weather data to the device
function returnWeatherData(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // Send a command to the device
        messaging.peerSocket.send(data);
    } else {
        console.log("Error: Connection is not open");
    }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function (evt) {
    if (evt.data && evt.data.command == "weather") {
        // The device requested weather data
        getWeather();
    }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function (err) {
    // Handle any errors
    console.log("Connection error: " + err.code + " - " + err.message);
}