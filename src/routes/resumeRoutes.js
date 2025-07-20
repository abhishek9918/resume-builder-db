const express = require("express");
const {
  createOrUpdateResume,
  getResumeById,
  resumeDeleteById,
} = require("../controllers/resumeController");
const { signUp, logIn } = require("../controllers/userController.js");
const router = express.Router();

router.post("/create-resume", createOrUpdateResume);
router.get("/get-resume-by-id/:resumeId", getResumeById);
router.delete("/delete-resume/:resumeId", resumeDeleteById);

router.post("/register_user", signUp);
router.post("/login_user", logIn);

module.exports = router;
