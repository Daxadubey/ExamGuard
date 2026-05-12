const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getResults = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await prisma.submission.findMany({
      where: { examId },
      include: {
        candidate: true,
        problem: true,
      },
    });

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};