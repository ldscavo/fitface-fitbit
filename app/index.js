import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// The labels for all the displayed data
const timeLabel = document.getElementById("time-label");
const stepsLabel = document.getElementById("steps-label");
const dateLabel = document.getElementById("date-label");

function getDateTime(evt) {
  return evt.date;
}
  
function updateDateTime(now) {
  updateTime(now);
  updateDate(now);
}

function updateTime(now) {
  let hours = now.getHours();

  if (preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12;
  }

  hours = util.zeroPad(hours);
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
  stepsLabel.text = "2863 Steps";
}

// The main tick event loop!
clock.ontick = (evt) => {
  let now = getDateTime(evt);
  
  updateDateTime(now);
  updateSteps();
}