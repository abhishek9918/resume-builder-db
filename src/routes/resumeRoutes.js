const express = require("express");
const {
  createOrUpdateResume,
  getResumeById,
  resumeDeleteById,
} = require("../controllers/resumeController");

const { verifyToken } = require("../../middleware/token");

const router = express.Router();

router.post("/create-resume", verifyToken, createOrUpdateResume);
router.get("/get-resume-by-id/:resumeId", verifyToken, getResumeById);
router.delete("/delete-resume/:resumeId", verifyToken, resumeDeleteById);

module.exports = router;
