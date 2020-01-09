import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { me as appbit } from "appbit";
import { today, goals } from "user-activity";
import * as messaging from "messaging";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// The labels for all the displayed data
const timeLabel = document.getElementById("time-label");
const stepsLabel = document.getElementById("steps-label");
const dateLabel = document.getElementById("date-label");
const tempLabel = document.getElementById("temp-label");

function getDateTime(evt) {
    return evt.date;
}

function getSteps() {
    let steps = 0;
    if (appbit.permissions.granted("access_activity")) {
        steps = today.adjusted.steps;
    }

    return steps;
}

function getStepGoal() {
    let goal = 0;
    if (appbit.permissions.granted("access_activity")) {
        goal = goals.adjusted.steps;
    }

    return steps;
}

function updateDateTime(now) {
    updateTime(now);
    updateDate(now);
}

function updateTime(now) {
    let hours = now.getHours();
    hours = preferences.clockDisplay === "12h" ? hours % 12 || 12 : util.zeroPad(hours);

    let mins = util.zeroPad(now.getMinutes());

    timeLabel.text = `${hours}:${mins}`;
}

function updateDate(now) {
    let month = util.months[now.getMonth()];
    let day = util.days[now.getDay()];
    let date = now.getDate();

    dateLabel.text = `${day} ${month} ${date}`;
}

function updateSteps() {
    let steps = getSteps();
    steps = steps.toLocaleString('en-US');

    stepsLabel.text = `${steps} Steps`;
}

function updateTemp(temp) {
    tempLabel.text = `${temp}°F`;
}

// Request weather data from the companion
function fetchWeather() {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // Send a command to the companion
        messaging.peerSocket.send({
            command: 'weather'
        });
    }
}

// Display the weather data received from the companion
function processWeatherData(data) {
    updateTemp(data.temperature);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function () {
    // Fetch weather when the connection opens
    fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function (evt) {
    if (evt.data) {
        processWeatherData(evt.data);
    }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function (err) {
    // Handle any errors
    console.log("Connection error: " + err.code + " - " + err.message);
}

// The main tick event loop!
clock.ontick = (evt) => {
    let now = getDateTime(evt);

    updateDateTime(now);
    updateSteps();
    //updateTemp();
}

// Fetch the weather every 30 minutes
setInterval(fetchWeather, 30 * 1000 * 60);