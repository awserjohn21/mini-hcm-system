const { db } = require("../config/firebaseAdmin");

const attendanceRef = db.collection("attendance");

// Create new attendance record( with date data for better filtering)
const createAttendance = async (data) => {
  try {
    const docRef = await attendanceRef.add(data);

    const createdDoc = await docRef.get();

    return {
      id: createdDoc.id,
      ...createdDoc.data(),
    };
  } catch (err) {
    throw err;
  }
};

const getLatestAttendance = async (userId) => {
  try {
    const snapshot = await attendanceRef
      .where("userId", "==", userId)
      .orderBy("timeIn", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    throw error;
  }
};

const updateAttendance = async (id, data) => {
  try {
    const docRef = attendanceRef.doc(id);

    await docRef.update(data);

    const updatedDoc = await docRef.get();

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  } catch (err) {
    throw err;
  }
};

const getAttendanceByUserId = async (userId) => {
  try {
    const snapshot = await attendanceRef
      .where("userId", "==", userId)
      .orderBy("timeIn", "desc")
      .get();

    const attendanceList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return attendanceList;
  } catch (err) {
    throw err;
  }
};

const getAllAttendance = async () => {
  try {
    const snapshot = await attendanceRef.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    throw err;
  }
};
const updateUserAttendance = async (attendanceId, data) => {
  const docRef = attendanceRef.doc(attendanceId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Attendance not found");
  }

  const current = doc.data();

  const timeIn = data.timeIn ?? current.timeIn;
  const timeOut = data.timeOut ?? current.timeOut;

  const inDate = timeIn ? new Date(timeIn) : null;
  const outDate = timeOut ? new Date(timeOut) : null;

  if (inDate && outDate) {
    if (outDate < inDate) {
      throw new Error("Time out cannot be before time in");
    }
  }

  await docRef.update({
    ...data,
    timeIn: inDate,
    timeOut: outDate,
  });

  const updatedDoc = await docRef.get();

  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  };
};

module.exports = {
  createAttendance,
  updateAttendance,
  updateUserAttendance,
  getLatestAttendance,
  getAttendanceByUserId,
  getAllAttendance,
};
