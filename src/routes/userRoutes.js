const express = require("express");

const {
  createOrUpdateUser,
  logIn,
  isUserLoggedIn,
} = require("../controllers/userController.js");
const { verifyToken } = require("../../middleware/token");
const router = express.Router();

router.post("/register_user", createOrUpdateUser);
router.post("/login_user", logIn);

router.get("/check-login", verifyToken, isUserLoggedIn);

module.exports = router;
