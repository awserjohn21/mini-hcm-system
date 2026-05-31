export const formatDate = (value) => {
  if (!value) return "";

  let date;

  // Firestore Timestamp
  if (value._seconds) {
    date = new Date(value._seconds * 1000);
  }
  // JS Date or ISO string
  else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-PH", {
    dateStyle: "medium",
  });
};

export const formatTime = (value) => {
  if (!value) return "";

  let date;

  // Firestore Timestamp
  if (value._seconds) {
    date = new Date(value._seconds * 1000);
  }
  // JS Date or ISO string
  else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-PH", {
    timeStyle: "short",
  });
};

export const formatScheduleTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatMinutes = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) {
    return `${hrs}h ${mins}m`;
  }

  if (hrs) {
    return `${hrs}h`;
  }

  return `${mins}m`;
};
