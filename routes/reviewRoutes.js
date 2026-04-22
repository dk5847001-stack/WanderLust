const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");

const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const { validateReview } = require("../validation");

// ================= CREATE REVIEW =================
router.post("/", validateReview, asyncWrap(async (req, res) => {
    const { id } = req.params;

    if (!req.body.review) {
        throw new ExpressError(400, "Review data missing");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review({
        comment: req.body.review.comment.trim(),
        rating: req.body.review.rating
    });

    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "Review added successfully!"); // Flash success message
    res.redirect(`/listings/${id}`);
}));

// ================= DELETE REVIEW =================
router.delete("/:reviewId", asyncWrap(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Review deleted successfully!"); // Flash error message
    res.redirect(`/listings/${id}`);
}));

module.exports = router;