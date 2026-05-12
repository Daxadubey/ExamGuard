const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getLogs = async (req, res) => {
  try {
    const { examId } = req.params;

    const logs = await prisma.proctoringLog.findMany({
      where: { examId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};