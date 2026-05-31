const express = require("express");
const {
  timeInController,
  timeOutController,
  userAttandanceController,
  allAttendanceController,
  updateUserAttendanceController,
  testAttendanceController,
} = require("../controllers/attendance.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const { authorizeRole } = require("../middlewares/authorizeRole");
const { attachUserRole } = require("../middlewares/attachUserRole");
const router = express.Router();

router.post("/attendance/test", testAttendanceController);

router.post(
  "/attendance/time-in",
  verifyToken,
  attachUserRole,
  authorizeRole("employee"),
  timeInController,
);

router.post(
  "/attendance/time-out",
  verifyToken,
  attachUserRole,
  authorizeRole("employee"),
  timeOutController,
);

router.get("/attendance", verifyToken, userAttandanceController);

// Admin only
router.get(
  "/attendance/all",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  allAttendanceController,
);

// Admin only
router.put(
  "/attendance/:attendanceId",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  updateUserAttendanceController,
);

module.exports = router;
