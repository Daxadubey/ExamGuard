const express = require("express");
const router = express.Router();

const { getResults } = require("../controllers/resultController");

const auth = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");

router.get("/:examId", auth, roleGuard("RECRUITER"), getResults);

module.exports = router;