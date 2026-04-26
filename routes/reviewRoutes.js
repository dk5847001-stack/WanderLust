const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");

const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const { validateReview } = require("../validation");
const { isLoggedIn, isReviewAuthor } = require("../middleware/middleware");
const reviewController = require("../controllers/reviewControllers");

// ================= CREATE REVIEW =================
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.createReview));

// ================= DELETE REVIEW =================
router.delete("/:reviewId", isReviewAuthor, asyncWrap(reviewController.deleteReview));

module.exports = router;