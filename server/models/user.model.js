const { db, auth } = require("../config/firebaseAdmin");

const userRef = db.collection("users");

const createUser = async (data) => {
  let userRecord;
  // Create user in Firebase Auth
  try {
    userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      emailVerified: false,
      disabled: false,
    });

    // Remove password from user data before saving to Firestore
    const { password, ...userData } = data;

    //Create user in Firestore database
    await userRef.doc(userRecord.uid).set({
      ...userData,
      email: userRecord.email,
      role: "employee",
      schedule: {
        start: "09:00",
        end: "18:00",
      },
    });
    return { id: userRecord.uid, ...userData, email: userRecord.email };
  } catch (err) {
    // Delete the user from Firebase Auth if there was an error creating the user in Firestore
    if (userRecord?.uid) {
      await auth.deleteUser(userRecord.uid);
    }
    throw err;
  }
};
const getUserById = async (uid) => {
  const doc = await userRef.doc(uid).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

const updateUserSchedule = async (uid, schedule) => {
  const docRef = userRef.doc(uid);

  const doc = await docRef.get();
  if (!doc.exists) return null;

  await docRef.update({
    schedule: {
      start: schedule.start,
      end: schedule.end,
    },
  });

  // 🔥 re-fetch updated document
  const updatedDoc = await docRef.get();

  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  };
};

const getAllUsers = async () => {
  const snapshot = await userRef.where("role", "!=", "admin").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
module.exports = { createUser, getUserById, getAllUsers, updateUserSchedule };
