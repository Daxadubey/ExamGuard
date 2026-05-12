const express = require("express");
const router = express.Router();

const {
  runCodeHandler,
  submitCode,
} = require("../controllers/submissionController");

const auth = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");

// Run code
router.post("/run", auth, roleGuard("CANDIDATE"), runCodeHandler);

// Submit code
router.post("/", auth, roleGuard("CANDIDATE"), submitCode);

module.exports = router;