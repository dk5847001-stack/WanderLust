const express = require("express");
const router = express.Router();

const Message = require("../models/message");
const asyncWrap = require("../utils/asyncWrapp");
const messageController = require("../controllers/messageControllers");

// ================= INDEX AND CREATE ROUTES =================
router.route("/")
.get(messageController.index)
.post(asyncWrap(messageController.createMessage))

// ================= READ =================
router.get("/read", asyncWrap(messageController.readMessages));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(messageController.editMessage));

// ================= UPDATE AND DELETE ROUTES =================
router.route("/:id")
.put(asyncWrap(messageController.updateMessage))
.delete(asyncWrap(messageController.deleteMessage))


module.exports = router;