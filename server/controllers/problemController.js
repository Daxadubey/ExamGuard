const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE PROBLEM
exports.createProblem = async (req, res) => {
  try {
    const {
      examId,
      title,
      description,
      difficulty,
      sampleInput,
      sampleOutput,
      marks,
    } = req.body;

    const problem = await prisma.problem.create({
      data: {
        examId,
        title,
        description,
        difficulty,
        sampleInput,
        sampleOutput,
        marks,
      },
    });

    res.json({ problem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD TEST CASE
exports.addTestCase = async (req, res) => {
  try {
    const { problemId, input, expectedOutput, isHidden } = req.body;

    const testCase = await prisma.testCase.create({
      data: {
        problemId,
        input,
        expectedOutput,
        isHidden,
      },
    });

    res.json({ testCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};