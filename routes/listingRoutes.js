const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const { validateListing } = require("../validation");
const { isLoggedIn, isOwner } = require("../middleware/middleware");
const { populate } = require("../models/review");
const listingController = require("../controllers/listingControllers");

// ================= INDEX =================
router.get("/", asyncWrap(listingController.index));

// ================= NEW =================
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ================= CREATE =================
router.post("/", isLoggedIn, validateListing, asyncWrap(listingController.createListing));

// ================= SHOW =================
router.get("/:id", asyncWrap(listingController.showListing));


// ================= EDIT =================
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.editListing));

// ================= UPDATE =================
router.put("/:id", isLoggedIn, isOwner, validateListing, asyncWrap(listingController.updateListing));

// ================= DELETE =================
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.deleteListing));

module.exports = router;