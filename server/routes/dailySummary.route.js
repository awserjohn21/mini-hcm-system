const express = require("express");
const { route } = require("./attendance.route");
const { verifyToken } = require("../middlewares/verifyToken");
const { authorizeRole } = require("../middlewares/authorizeRole");
const {
  userDailySummaryController,
  userWeeklySummaryController,
  adminDailySummaryController,
} = require("../controllers/dailySummary.controller");
const { attachUserRole } = require("../middlewares/attachUserRole");

const router = express.Router();
router.get("/dailySummary", verifyToken, userDailySummaryController);
router.get(
  "/weeklySummary/:userId",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  userWeeklySummaryController,
);

router.get(
  "/dailySummary/all",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  adminDailySummaryController,
);

module.exports = router;
