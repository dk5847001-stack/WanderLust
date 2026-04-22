const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const { validateListing } = require("../validation");

// ================= INDEX =================
router.get("/", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// ================= NEW =================
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// ================= CREATE =================
router.post("/", validateListing, asyncWrap(async (req, res) => {
    const listingData = req.body.listing;
    if (!listingData) {
        throw new ExpressError(400, "Invalid listing data");
    }

    if (!listingData.image?.url?.trim()) {
        listingData.image = {
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"
        };
    }
    req.flash("success", "New Listion created successfully!"); // Flash success message
    await Listing.create(listingData);
    res.redirect("/listings");
}));

// ================= SHOW =================
router.get("/:id", asyncWrap(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings"); // ✅ fix
    }

    let avgRating = 0;
    if (listing.reviews.length > 0) {
        avgRating =
            listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
            listing.reviews.length;
    }

    res.render("listings/show", { 
        listing,
        listings: listing,
        avgRating
    });
}));

// ================= EDIT =================
router.get("/:id/edit", asyncWrap(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings"); // ✅ fix
    }
    }

    res.render("listings/edit", { listing });
}));

// ================= UPDATE =================
router.put("/:id", validateListing, asyncWrap(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    req.flash("success", "Listing updated successfully!"); // Flash success message
    res.redirect("/listings");
}));

// ================= DELETE =================
router.delete("/:id", asyncWrap(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("error", "Listing deleted successfully!"); // Flash error message
    res.redirect("/listings");
}));

module.exports = router;