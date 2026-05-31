const express = require("express");
const {
  createUserController,
  getAllUsersController,
  updateUserScheduleController,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const { getMeController } = require("../controllers/user.controller");
const { attachUserRole } = require("../middlewares/attachUserRole");
const { authorizeRole } = require("../middlewares/authorizeRole");
const router = express.Router();

router.post("/auth/register", createUserController);
router.get("/me", verifyToken, getMeController);

router.put(
  "/users/:userId/schedule",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  updateUserScheduleController,
);

router.get(
  "/users/all",
  verifyToken,
  attachUserRole,
  authorizeRole("admin"),
  getAllUsersController,
);
module.exports = router;
