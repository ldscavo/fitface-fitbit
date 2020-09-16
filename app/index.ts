import clock, { TickEvent } from "clock";
import document from "document";
import { preferences } from "user-settings";
import { me as appbit } from "appbit";
import { today, goals } from "user-activity";
import * as messaging from "messaging";
import { zeroPad, days, months, WeatherResponse} from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// The labels for all the displayed data
const timeLabel = document.getElementById("time-label");
const stepsLabel = document.getElementById("steps-label");
const dateLabel = document.getElementById("date-label");
const tempLabel = document.getElementById("temp-label");

// The svg object for the step progress circle
const stepsCircle = document.getElementById("steps-circle") as ArcElement;

var getDateTime = (evnt: TickEvent) => evnt.date;

var getSteps = (): number =>
  // @ts-ignore
  appbit.permissions.granted("access_activity")
    ? today.adjusted.steps ?? 0
    : 0;

var getStepGoal = () =>
  // @ts-ignore
  appbit.permissions.granted("access_activity")
    ? goals.steps ?? 0
    : 0;

var updateTime = (now: Date) => {
  let hours = now.getHours();
  let displayedHours = preferences.clockDisplay === "12h"
    ? hours % 12 || 12
    : zeroPad(hours);

  let mins = zeroPad(now.getMinutes());

  if (timeLabel != null){
    timeLabel.text = `${displayedHours}:${mins}`;
  }
}

var updateStepCircle = () => {
  let steps = getSteps();
  let goal = getStepGoal();

  stepsCircle.sweepAngle = stepGoalAngle(steps, goal);
}

var updateDate = (now: Date) => {
  let month = months[now.getMonth()];
  let day = days[now.getDay()];
  let date = now.getDate();

  if (dateLabel != null){
    dateLabel.text = `${day} ${month} ${date}`;
  }
}

var updateSteps = () => {
  let steps = getSteps().toLocaleString('en-US');
  
  if (stepsLabel != null){
    stepsLabel.text = `${steps} Steps`;
  }
}

var stepGoalAngle = (count: number, goal: number) =>
  goal > count
    ? 360 * count / goal
    : 360;

var updateTemp = (temp: number) => {
  if (tempLabel != null){
    tempLabel.text = `${temp}°F`;
  }
}

// Request weather data from the companion
var fetchWeather = () => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Display the weather data received from the companion
var processWeatherData = (data: WeatherResponse) => {
  updateTemp(data.temperature);
}

// Listen for the onopen event
messaging.peerSocket.onopen = () => {
  // Fetch weather when the connection opens
  fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = evnt => {
  if (evnt.data) {
    processWeatherData(evnt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = err => {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// The main tick event loop!
clock.ontick = evnt => {
  let now = getDateTime(evnt);

  updateTime(now);
  updateDate(now);
  
  updateSteps();
  updateStepCircle();
}

// Fetch the weather every 30 minutes
setInterval(fetchWeather, 30 * 1000 * 60);