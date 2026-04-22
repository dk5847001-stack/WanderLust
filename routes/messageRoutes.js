const express = require("express");
const router = express.Router();

const Message = require("../models/message");
const asyncWrap = require("../utils/asyncWrapp");

// ================= FORM =================
router.get("/", (req, res) => {
    res.render("message/message");
});

// ================= CREATE =================
router.post("/", asyncWrap(async (req, res) => {
    await Message.create(req.body);
    req.flash("success", "Message sent successfully!"); // Flash success message
    res.redirect("/message");
}));

// ================= READ =================
router.get("/read", asyncWrap(async (req, res) => {
    const messages = await Message.find({});
    res.render("message/adminMessage", { messages });
}));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(async (req, res) => {
    const message = await Message.findById(req.params.id);
    res.render("message/edit", { message });
}));

// ================= UPDATE =================
router.put("/:id", asyncWrap(async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Message updated successfully!"); // Flash success message
    res.redirect("/message/read");
}));

// ================= DELETE =================
router.delete("/:id", asyncWrap(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
req.flash("error", "Message deleted successfully!"); // Flash error message
    res.redirect("/message/read");
}));

module.exports = router;