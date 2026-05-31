const admin = require("firebase-admin");
const { getUserById } = require("../models/user.model");

const attachUserRole = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      ...req.user,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { attachUserRole };
