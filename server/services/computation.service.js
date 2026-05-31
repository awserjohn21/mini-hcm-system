const { NIGHT_START, NIGHT_END } = require("../config/time.js");

const computeRegularHours = (timeIn, timeOut, scheduleMin) => {
  const shiftStart = Math.max(timeIn, scheduleMin.start);
  const shiftEnd = Math.min(timeOut, scheduleMin.end);
  console.log(scheduleMin);
  return Math.max(0, shiftEnd - shiftStart);
};

const computeOvertime = (timeIn, timeOut, scheduleMin) => {
  return Math.max(0, timeOut - scheduleMin.end);
};

const computeNightDiff = (timeIn, timeOut) => {
  const start = Math.max(timeIn, NIGHT_START);
  const end = Math.min(timeOut, NIGHT_END);
  return Math.max(0, end - start);
};

const computeLate = (timeIn, scheduleMin) => {
  return Math.max(0, timeIn - scheduleMin.start);
};

const computeUndertime = (timeOut, scheduleMin) => {
  return Math.max(0, scheduleMin.end - timeOut);
};
module.exports = {
  computeRegularHours,
  computeOvertime,
  computeNightDiff,
  computeLate,
  computeUndertime,
};
