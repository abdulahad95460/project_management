const express = require("express");
const router = express.Router({ mergeParams: true });
    const { createTask, getTasks, getTask, updateTask, deleteTask } = require("../controllers/taskController");
   const authMiddleware = require("../middleware/authMiddleware");

   router.post("/", authMiddleware, createTask);
 router.get("/", authMiddleware, getTasks);
 router.get("/:taskId", authMiddleware, getTask);
 router.put("/:taskId", authMiddleware, updateTask);
 router.delete("/:taskId", authMiddleware, deleteTask);

module.exports = router;
