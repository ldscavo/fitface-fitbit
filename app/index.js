import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { me as appbit } from "appbit";
import { today, goals } from "user-activity";
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

function getTemp() {
  return 75;
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

function updateTemp() {
  let temp = getTemp();
  tempLabel.text = `${temp}°F`;
}

// The main tick event loop!
clock.ontick = (evt) => {
  let now = getDateTime(evt);
  
  updateDateTime(now);
  updateSteps();
  updateTemp();
}