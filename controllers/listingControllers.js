const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

// ================= INDEX =================
module.exports.index = async (req, res) => {
    let { category, search, price } = req.query;

    let filter = {};

    if (category) filter.category = category;

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (price) {
        filter.price = { $lte: Number(price) };
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index", {
        allListings,
        category
    });
};
// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

// ================= CREATE =================
module.exports.createListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }

    let listingData = req.body.listing;
    listingData.owner = req.user._id;

    // image
    if (req.file) {
        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // 🗺️ GEOCODING (MapTiler)
    const apiKey = process.env.MAPTILER_KEY;
    const place = `${listingData.location}, ${listingData.country}`;

    const geoRes = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(place)}.json?key=${apiKey}`
    );

    const geoData = await geoRes.json();

    if (geoData.features.length) {
        listingData.geometry = {
            type: "Point",
            coordinates: geoData.features[0].center
        };
    }

    await Listing.create(listingData);

    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");
};

// ================= SHOW =================
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let avgRating = 0;
    if (listing.reviews.length) {
        avgRating =
            listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
            listing.reviews.length;
    }

    res.render("listings/show", { listing, avgRating });
};

// ================= EDIT =================
module.exports.editListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
};

// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// ================= DELETE =================
module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};