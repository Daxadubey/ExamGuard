require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Routes
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const proctorRoutes = require("./routes/proctorRoutes");

const app = express();
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Make io available in controllers if needed
app.set("io", io);

// 🔹 MIDDLEWARE
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 🔹 ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/proctor", proctorRoutes);

// ================= SOCKET LOGIC ================= //

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  /**
   * JOIN EXAM ROOM
   * candidateId is important for logging
   */
  socket.on("join_exam", ({ examId, candidateId }) => {
    socket.join(examId);
    socket.data = { examId, candidateId }; // store in socket session
    console.log(`User joined exam ${examId}`);
  });

  /**
   * PROCTORING EVENTS
   */
  socket.on("proctor_event", async (data) => {
    try {
      const { examId, eventType } = data;

      const candidateId = socket.data?.candidateId;

      if (!candidateId) {
        console.warn("⚠️ Missing candidateId in socket");
        return;
      }

      // ✅ Save to DB
      await prisma.proctoringLog.create({
        data: {
          examId,
          candidateId,
          eventType,
        },
      });

      // ✅ Broadcast to recruiters (observers)
      io.to(examId).emit("proctor_update", {
        candidateId,
        eventType,
        timestamp: new Date(),
      });

    } catch (err) {
      console.error("❌ Proctoring error:", err.message);
    }
  });

  /**
   * DISCONNECT
   */
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= ERROR HANDLING ================= //

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

// ================= SERVER START ================= //

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});