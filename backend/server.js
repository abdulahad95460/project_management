require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

   const authMiddleware = require("./middleware/authMiddleware");

   const projectRoutes = require("./routes/ProjectRoutes");



   const taskRoutes = require("./routes/taskRoutes");
const memberRoutes = require("./routes/memberRoutes");

  const app = express();
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/projects/:projectId/members", memberRoutes);

      app.get("/api/test", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        userId: req.userId
    });
});
app.get("/", (req, res) => {
    res.send("ProjectFlow API is running");
});

connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`ProjectFlow server is running on port ${PORT}`);
});