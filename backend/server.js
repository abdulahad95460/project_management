const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("ProjectFlow API is running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`ProjectFlow server is running on port ${PORT}`);
});