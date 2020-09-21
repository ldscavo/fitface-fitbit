import * as messaging from "messaging";
import { WeatherResponse } from "../common/utils";

export let getWeatherData = async (pos: Position) => {
  let apiKey = "499b4f8b067ddc0eac377f41fd5c7a7e";
  let queryParams = `units=imperial&appid=${apiKey}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
  let url = `https://api.openweathermap.org/data/2.5/weather?${queryParams}`;

  let response = await fetch(url);
  let data = await response.json();

  returnWeatherData({
    temperature: parseInt(data["main"]["temp"])
  });  
}

// Send the weather data to the device
let returnWeatherData = (data: WeatherResponse) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}