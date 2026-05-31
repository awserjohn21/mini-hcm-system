const {
  calculateUserSummary,
  calculateUserWeeklySummary,
  getAllDailySummaries,
} = require("../models/dailySummary.model");
const { getUserById } = require("../models/user.model");

const getDailySummariesByUser =
  require("../models/dailySummary.model").getDailySummariesByUser;

const adminDailySummaryController = async (req, res) => {
  try {
    const summaries = await getAllDailySummaries();

    res.status(200).json({
      data: summaries,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const userDailySummaryController = async (req, res) => {
  try {
    const userId = req.user.uid;
    const summaries = await getDailySummariesByUser(userId);
    const userStats = await calculateUserSummary(userId);
    const userData = await getUserById(userId);
    res.status(200).json({
      data: summaries,
      userStats: userStats,
      name: userData.name,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const userWeeklySummaryController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    if (!date) {
      return res.status(400).json({ error: "Missing date" });
    }

    const parsedDate = new Date(date);

    console.log("PARSED DATE", parsedDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const summary = await calculateUserWeeklySummary(userId, parsedDate);
    const userStats = await calculateUserSummary(userId);
    return res.status(200).json({
      summary,
      userStats,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  userDailySummaryController,
  userWeeklySummaryController,
  adminDailySummaryController,
};
