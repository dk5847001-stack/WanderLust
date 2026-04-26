const express = require("express");
const router = express.Router();

const Subscriber = require("../models/subscriber");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const subscriberController = require("../controllers/subscriberControllers");

// ================= CREATE =================
router.post("/", asyncWrap(subscriberController.createSubscriber));

// ================= READ ALL =================
router.get("/", asyncWrap(subscriberController.readSubscribers));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(subscriberController.editSubscriber));

// ================= UPDATE =================
router.put("/:id", asyncWrap(subscriberController.updateSubscriber));

// ================= DELETE =================
router.delete("/:id", asyncWrap(subscriberController.deleteSubscriber));

module.exports = router;