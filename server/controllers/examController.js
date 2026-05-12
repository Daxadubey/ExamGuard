const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE EXAM
exports.createExam = async (req, res) => {
  try {
    const { title, description, duration, startTime, endTime } = req.body;

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        duration,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: req.user.id,
      },
    });

    res.json({ exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET EXAMS
exports.getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        problems: true,
      },
    });

    res.json({ exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ENROLL IN EXAM
exports.enrollExam = async (req, res) => {
  try {
    const { examId } = req.body;

    const enrollment = await prisma.examEnrollment.create({
      data: {
        examId,
        candidateId: req.user.id,
        status: "ACTIVE",
      },
    });

    res.json({ enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};