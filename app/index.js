import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const timeLabel = document.getElementById("time-label");
const stepsLabel = document.getElementById("steps-label");
const dateLabel = document.getElementById("date-label");

function updateSteps() {
  stepsLabel.text = "2863 Steps";
}

function updateDate() {
  dateLabel.text = "Tue Apr 9";
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;
  
  updateDate();
  updateSteps();
}


