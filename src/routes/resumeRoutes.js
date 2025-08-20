const express = require("express");
const {
  createOrUpdateResume,
  getResumeById,
  resumeDeleteById,
  getAllUserResumes,
  getResumeByUserId,
  duplcateResume,
  deleteResume,
} = require("../controllers/resumeController");

const { verifyToken } = require("../../middleware/token");

const router = express.Router();

router.post("/create-resume", verifyToken, createOrUpdateResume);

router.get("/get-all-resumes", verifyToken, getAllUserResumes);
router.get("/get-resume-by-id/:resumeId", verifyToken, getResumeById);
router.get("/get_Resume_By_UserId/:userId", verifyToken, getResumeByUserId);
router.delete("/delete-resume/:resumeId", verifyToken, resumeDeleteById);
router.post("/resume_duplicate/:resumeId", verifyToken, duplcateResume);
router.delete("/delete_resume/:resumeId", verifyToken, deleteResume);

module.exports = router;
