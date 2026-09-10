const express = require("express");
const router = express.Router({ mergeParams: true });
const { addMember, getMembers, removeMember } = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addMember);
router.get("/", authMiddleware, getMembers);
router.delete("/:userId", authMiddleware, removeMember);

module.exports = router;
