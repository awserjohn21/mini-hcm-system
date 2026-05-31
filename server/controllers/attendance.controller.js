const {
  updateAttendance,
  createAttendance,
  getLatestAttendance,
  getAttendanceByUserId,
  getAllAttendance,
  updateUserAttendance,
} = require("../models/attendance.model");

const { toPunchMinutes, toScheduleMinutes } = require("../utils/time.utils");
const { createDailySummary } = require("../models/dailySummary.model");
const {
  computeRegularHours,
  computeOvertime,
  computeNightDiff,
  computeLate,
  computeUndertime,
} = require("../services/computation.service");
const { getUserById, getAllUsers } = require("../models/user.model.js");

const testAttendanceController = (req, res) => {
  try {
    const { schedule, timeIn, timeOut } = req.body;

    if (!schedule || timeIn == null || timeOut == null) {
      return res.status(400).json({
        message: "schedule, timeIn, timeOut required",
      });
    }

    const sched = toScheduleMinutes(schedule);

    let inMin = timeIn;
    let outMin = timeOut;

    if (outMin < inMin) {
      outMin += 1440;
    }

    const result = {
      regularHours: computeRegularHours(inMin, outMin, sched),
      overtime: computeOvertime(inMin, outMin, sched),
      nightDifferential: computeNightDiff(inMin, outMin),
      late: computeLate(inMin, sched),
      undertime: computeUndertime(outMin, sched),
    };

    return res.json({
      input: { schedule, timeIn, timeOut },
      minutes: { inMin, outMin, schedule: sched },
      result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const timeInController = async (req, res) => {
  try {
    const userId = req.user.uid;
    const latestPunch = await getLatestAttendance(userId);

    // Get the user data
    const user = await getUserById(userId);

    // If latest punch is active user is already clocked in
    if (latestPunch && latestPunch.completed == false) {
      return res.status(400).json({
        error: "You are already clocked in.",
      });
    }

    // Check if already completed attendance for today
    const latestPunchDate = latestPunch?.timeIn?.toDate();
    if (latestPunchDate) {
      const today = new Date();

      const isSameDay =
        latestPunchDate.getFullYear() === today.getFullYear() &&
        latestPunchDate.getMonth() === today.getMonth() &&
        latestPunchDate.getDate() === today.getDate();

      if (latestPunch.completed && isSameDay) {
        return res.status(400).json({
          error: "You already completed attendance for today.",
        });
      }
    }

    // Create new attendance record
    const attendance = await createAttendance({
      userId,
      timeIn: new Date(),
      completed: false,
    });

    return res.status(200).json({
      record: {
        ...attendance,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const timeOutController = async (req, res) => {
  try {
    const userId = req.user.uid;
    const latestPunch = await getLatestAttendance(userId);

    // Get the user data
    const user = await getUserById(userId);

    if (!latestPunch) {
      return res.status(400).json({
        error: "You must clock in before clocking out.",
      });
    }

    // If latest punch is completed user is already clocked OUT
    if (latestPunch.completed) {
      return res.status(400).json({
        error: "You are already clocked out.",
      });
    }

    const timeOutStamp = new Date();

    // Update the punch in attendance
    const attendance = await updateAttendance(latestPunch.id, {
      completed: true,
      timeOut: timeOutStamp,
    });

    // Structure
    const timeIn = toPunchMinutes(latestPunch.timeIn.toDate());
    let timeOut = toPunchMinutes(attendance.timeOut.toDate());
    const scheduleMin = toScheduleMinutes(user.schedule);
    console.log("IN", latestPunch.timeIn.toDate());
    console.log("OUT", attendance.timeOut.toDate());

    if (timeOut < timeIn) timeOut += 1440;

    // Computation
    const regularHours = computeRegularHours(timeIn, timeOut, scheduleMin);
    const overtime = computeOvertime(timeIn, timeOut, scheduleMin);
    const nightDifferential = computeNightDiff(timeIn, timeOut);
    const late = computeLate(timeIn, scheduleMin);
    const undertime = computeUndertime(timeOut, scheduleMin);

    const summaryData = {
      userId: userId,
      attendanceId: latestPunch.id,
      date: latestPunch.timeIn,
      regularHours,
      overtime,
      nightDifferential,
      late,
      undertime,
    };

    await createDailySummary(summaryData);

    return res.status(200).json({
      record: {
        ...attendance,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userAttandanceController = async (req, res) => {
  try {
    const userId = req.user.uid;
    const attendanceRecords = await getAttendanceByUserId(userId);

    const userData = await getUserById(userId);
    return res.status(200).json({
      user: userData,
      attendance: attendanceRecords,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const updateUserAttendanceController = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    if (!attendanceId) {
      return res.status(400).json({ error: "Missing attendanceId" });
    }

    const data = {
      timeIn: req.body.timeIn,
      timeOut: req.body.timeOut,
    };

    if (!data.timeIn && !data.timeOut) {
      return res.status(400).json({ error: "No data to update" });
    }

    if (data.timeIn && isNaN(new Date(data.timeIn).getTime())) {
      return res.status(400).json({ error: "Invalid timeIn" });
    }

    if (data.timeOut && isNaN(new Date(data.timeOut).getTime())) {
      return res.status(400).json({ error: "Invalid timeOut" });
    }

    const updated = await updateUserAttendance(attendanceId, data);
    const userData = await getUserById(updated.userId);

    return res.status(200).json({
      message: "Updated",
      record: {
        ...updated,
        name: userData.name,
        email: userData.email,
        timezone: userData.timezone,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const allAttendanceController = async (req, res) => {
  try {
    const attendanceRecords = await getAllAttendance();
    const usersData = await getAllUsers();

    const usersMap = new Map(usersData.map((user) => [user.id, user]));

    const attendanceWithUsers = attendanceRecords.map((attendance) => {
      const user = usersMap.get(attendance.userId);

      return {
        ...attendance,
        name: user?.name || "Unknown",
        email: user?.email || null,
        timezone: user?.timezone,
      };
    });

    res.status(200).json(attendanceWithUsers);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  timeInController,
  timeOutController,
  userAttandanceController,
  allAttendanceController,
  updateUserAttendanceController,
  testAttendanceController,
};
