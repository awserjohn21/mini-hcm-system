const { db, admin } = require("../config/firebaseAdmin");
const { getAllUsers } = require("./user.model");

const dailySummaryRef = db.collection("dailySummary");
const createDailySummary = async (data) => {
  try {
    const docRef = await dailySummaryRef.add(data);
    return { id: docRef.id, ...data };
  } catch (err) {
    throw err;
  }
};

const getDailySummariesByUser = async (userId) => {
  try {
    const snapshot = await dailySummaryRef
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results;
  } catch (err) {
    throw err;
  }
};

const getAllDailySummaries = async () => {
  try {
    const summarySnap = await dailySummaryRef.orderBy("date", "desc").get();
    const users = await getAllUsers();

    if (summarySnap.empty) return [];

    return summarySnap.docs.map((doc) => {
      const data = doc.data();

      const user = users.find((u) => u.id === data.userId);

      return {
        id: doc.id,
        ...data,
        name: user?.name || "",
        email: user?.email || "",
      };
    });
  } catch (err) {
    throw err;
  }
};

const calculateUserSummary = async (userId) => {
  try {
    const snapshot = await dailySummaryRef.where("userId", "==", userId).get();

    const summaries = snapshot.docs.map((doc) => doc.data());

    let totalRegular = 0;
    let totalOT = 0;
    let totalND = 0;
    let totalLate = 0;
    let totalUT = 0;

    for (const s of summaries) {
      totalRegular += s.regularHours || 0;
      totalOT += s.overtime || 0;
      totalND += s.nightDifferential || 0;
      totalLate += s.late || 0;
      totalUT += s.undertime || 0;
    }

    return {
      userId,
      totalRegular,
      totalOT,
      totalND,
      totalLate,
      totalUT,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
const calculateUserWeeklySummary = async (userId, weekStartDate) => {
  try {
    const start = new Date(weekStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    end.setUTCHours(23, 59, 59, 999);

    const startTs = admin.firestore.Timestamp.fromDate(start);
    const endTs = admin.firestore.Timestamp.fromDate(end);

    const snapshot = await dailySummaryRef
      .where("userId", "==", userId)
      .where("date", ">=", startTs)
      .where("date", "<=", endTs)
      .get();

    const result = {
      totalRegularHours: 0,
      totalOvertimeHours: 0,
      totalNightDiffHours: 0,
      totalLateMinutes: 0,
      totalUndertimeMinutes: 0,
      startDate: start,
      endDate: end,
    };

    snapshot.forEach((doc) => {
      const s = doc.data();

      result.totalRegularHours += s.regularHours || 0;
      result.totalOvertimeHours += s.overtime || 0;
      result.totalNightDiffHours += s.nightDifferential || 0;
      result.totalLateMinutes += s.late || 0;
      result.totalUndertimeMinutes += s.undertime || 0;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  createDailySummary,
  getAllDailySummaries,
  getDailySummariesByUser,
  calculateUserSummary,
  calculateUserWeeklySummary,
};
