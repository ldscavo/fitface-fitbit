import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { getWeatherData } from "./weather" 

// Listen for messages from the device
messaging.peerSocket.onmessage = function (evnt) {
  if (evnt.data && evnt.data.command == "weather") {
    // The device requested weather data
    geolocation.getCurrentPosition(getWeatherData);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function (err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}