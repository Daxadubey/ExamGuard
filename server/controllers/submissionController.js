const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const runCode = require("../utils/codeRunner");
const calculateScore = require("../utils/scoreCalculator");

// 🔥 Normalize output for better comparison
const normalizeOutput = (output) => {
  return output?.trim().replace(/\r\n/g, "\n");
};

// 🔥 Cheating score calculation
const calculateCheatingScore = (logs) => {
  let score = 0;

  logs.forEach((log) => {
    switch (log.eventType) {
      case "TAB_SWITCH":
        score += 5;
        break;
      case "EXIT_FULLSCREEN":
        score += 10;
        break;
      case "BLOCKED_KEY":
        score += 3;
        break;
      case "IDLE":
        score += 2;
        break;
      default:
        break;
    }
  });

  return score;
};

// ================= RUN CODE ================= //

exports.runCodeHandler = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const sampleCases = problem.testCases.filter((tc) => !tc.isHidden);

    const results = [];

    for (let tc of sampleCases) {
      const result = await runCode(language, code, tc.input);

      results.push({
        input: tc.input,
        expected: tc.expectedOutput,
        output: result.output || result.error,
      });
    }

    res.json({ results });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SUBMIT CODE ================= //

exports.submitCode = async (req, res) => {
  try {
    const { code, language, problemId, examId } = req.body;

    // 🔹 Validation
    if (!code || !language || !problemId || !examId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 🔹 Fetch problem
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    let passed = 0;
    const total = problem.testCases.length;

    // 🔹 Run against all test cases
    for (let tc of problem.testCases) {
      const result = await runCode(language, code, tc.input);

      const userOutput = normalizeOutput(result.output || "");
      const expectedOutput = normalizeOutput(tc.expectedOutput);

      if (userOutput === expectedOutput) {
        passed++;
      }
    }

    // 🔹 Score calculation
    const score = calculateScore(passed, total, problem.marks);

    // 🔥 Fetch proctoring logs
    const logs = await prisma.proctoringLog.findMany({
      where: {
        examId,
        candidateId: req.user.id,
      },
    });

    const cheatingScore = calculateCheatingScore(logs);

    // 🔹 Save submission
    const submission = await prisma.submission.create({
      data: {
        candidateId: req.user.id,
        problemId,
        examId,
        code,
        language,
        score,
        passedCases: passed,
        totalCases: total,
      },
    });

    // 🔹 Response
    res.json({
      submission,
      result: {
        passed,
        total,
        score,
        cheatingScore,
      },
    });

  } catch (err) {
    console.error("Submission Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};