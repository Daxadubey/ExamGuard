const express = require("express");
const router = express.Router();

const { getLogs } = require("../controllers/proctorController");

const auth = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");

router.get("/:examId", auth, roleGuard("RECRUITER"), getLogs);

module.exports = router;