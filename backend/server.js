require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

   const authMiddleware = require("./middleware/authMiddleware");

const app = express();
     app.use(express.json());
app.use("/api/auth", authRoutes);

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
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`ProjectFlow server is running on port ${PORT}`);
});