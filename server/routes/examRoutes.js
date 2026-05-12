const express = require("express");
const router = express.Router();

const {
  createExam,
  getExams,
  enrollExam,
} = require("../controllers/examController");

const auth = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");

// Recruiter creates exam
router.post("/", auth, roleGuard("RECRUITER"), createExam);

// Get all exams
router.get("/", auth, getExams);

// Candidate joins exam
router.post("/enroll", auth, roleGuard("CANDIDATE"), enrollExam);

module.exports = router;