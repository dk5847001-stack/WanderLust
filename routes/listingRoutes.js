const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrapp");
const { validateListing } = require("../validation");
const { isLoggedIn, isOwner } = require("../middleware/middleware");
const listingController = require("../controllers/listingControllers");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// ================= API (SEARCH + FILTER + PRICE) =================
router.get("/api", asyncWrap(async (req, res) => {
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

    const listings = await Listing.find(filter);

    res.json(listings);
}));

// ================= MAIN =================
router.route("/")
.get(asyncWrap(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    asyncWrap(listingController.createListing)
);

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(asyncWrap(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    asyncWrap(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    asyncWrap(listingController.deleteListing)
);

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    asyncWrap(listingController.editListing)
);

module.exports = router;