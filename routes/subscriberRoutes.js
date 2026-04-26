const express = require("express");
const router = express.Router();

const Subscriber = require("../models/subscriber");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const subscriberController = require("../controllers/subscriberControllers");

router.route("/")
.get(asyncWrap(subscriberController.readSubscribers))
.post(asyncWrap(subscriberController.createSubscriber))

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(subscriberController.editSubscriber));

// ================= UPDATE AND DELETE ROUTES =================
router.route("/:id")
.put(asyncWrap(subscriberController.updateSubscriber))
.delete(asyncWrap(subscriberController.deleteSubscriber))



module.exports = router;