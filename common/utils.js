// Add zero in front of numbers < 10
export const zeroPad = i =>
  (i < 10)
    ? "0" + i
    : i;

// All the names used for the date output
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];