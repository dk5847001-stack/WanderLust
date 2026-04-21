const express = require("express");
const router = express.Router();

const Subscriber = require("../models/subscriber");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");

// ================= CREATE =================
router.post("/", asyncWrap(async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        throw new ExpressError(400, "Email is required");
    }

    await Subscriber.create({ email: email.trim() });

    res.redirect("/subscriber");
}));

// ================= READ ALL =================
router.get("/", asyncWrap(async (req, res) => {
    const subscribers = await Subscriber.find({});

    // 👇 IMPORTANT FIX (dual variable pass)
    res.render("subscriber/subscriber", { 
        subscribers, 
        subscriber: subscribers   // 👈 EJS compatibility fix
    });
}));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
        throw new ExpressError(404, "Subscriber not found");
    }

    res.render("subscriber/edit", { subscriber });
}));

// ================= UPDATE =================
router.put("/:id", asyncWrap(async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        throw new ExpressError(400, "Email is required");
    }

    await Subscriber.findByIdAndUpdate(req.params.id, {
        email: email.trim()
    });

    res.redirect("/subscriber");
}));

// ================= DELETE =================
router.delete("/:id", asyncWrap(async (req, res) => {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.redirect("/subscriber");
}));

module.exports = router;