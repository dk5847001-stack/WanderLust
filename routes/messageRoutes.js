const express = require("express");
const router = express.Router();

const Message = require("../models/message");
const asyncWrap = require("../utils/asyncWrapp");
const messageController = require("../controllers/messageControllers");

// ================= FORM =================
router.get("/", messageController.index);

// ================= CREATE =================
router.post("/", asyncWrap(messageController.createMessage));

// ================= READ =================
router.get("/read", asyncWrap(messageController.readMessages));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(messageController.editMessage));

// ================= UPDATE =================
router.put("/:id", asyncWrap(messageController.updateMessage));

// ================= DELETE =================
router.delete("/:id", asyncWrap(messageController.deleteMessage));

module.exports = router;