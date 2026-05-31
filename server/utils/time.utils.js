const { DateTime } = require("luxon");

const toPunchMinutes = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

const toScheduleMinutes = (schedule) => {
  const [startH, startM] = schedule.start.split(":").map(Number);
  const [endH, endM] = schedule.end.split(":").map(Number);

  let start = startH * 60 + startM;
  let end = endH * 60 + endM;

  // handle overnight schedule
  if (end <= start) {
    end += 1440;
  }

  return { start, end };
};

module.exports = {
  toPunchMinutes,
  toScheduleMinutes,
};
