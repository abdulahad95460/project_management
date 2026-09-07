require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");


const app = express();
app.use(express.json());
connectDB()
app.get("/", (req, res) => {
    res.send("ProjectFlow API is running");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`ProjectFlow server is running on port ${PORT}`);
});