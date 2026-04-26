const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.createListing = async (req, res) => {
    const listingData = req.body.listing;
    listingData.owner = req.user._id; // Associate listing with logged-in user
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
}

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
            path: "author"
        }})
        .populate("owner");

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
}

module.exports.editListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings"); // ✅ fix
        }
    }

    res.render("listings/edit", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing updated successfully!"); // Flash success message
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("error", "Listing deleted successfully!"); // Flash error message
    res.redirect("/listings");
}