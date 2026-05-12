const express = require("express");
const router = express.Router();

const {
  createProblem,
  addTestCase,
} = require("../controllers/problemController");

const auth = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");

// Add problem
router.post("/", auth, roleGuard("RECRUITER"), createProblem);

// Add test case
router.post("/testcase", auth, roleGuard("RECRUITER"), addTestCase);

module.exports = router;