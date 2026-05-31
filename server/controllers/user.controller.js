const {
  createUser,
  getUserById,
  getAllUsers,
  updateUserSchedule,
} = require("../models/user.model");

const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMeController = async (req, res) => {
  try {
    const user = await getUserById(req.user.uid);

    return res.status(200).json({
      uid: req.user.uid,
      email: req.user.email,
      ...user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateUserScheduleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { schedule } = req.body;

    const result = await updateUserSchedule(userId, schedule);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: result,
    });
  } catch (err) {
    console.error("Update schedule error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing userId",
      });
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createUserController,
  getUserController,
  getMeController,
  getAllUsersController,
  updateUserScheduleController,
};
