const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const { validateListing } = require("../validation");
const { isLoggedIn, isOwner } = require("../middleware/middleware");
const { populate } = require("../models/review");
const listingController = require("../controllers/listingControllers");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// =================INDEX AND CREATE ROUTES=================
router
.route("/")
.get(asyncWrap(listingController.index))
// .post(isLoggedIn, validateListing, asyncWrap(listingController.createListing))
.post(upload.single('listing[image][url]'), (req, res)=>{
    res.send(req.file)
})

// ================= NEW =================
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ================= SHOW, UPDATE, AND DELETE ROUTES =================
router
.route("/:id")
.get(asyncWrap(listingController.showListing))
.put(isLoggedIn, isOwner, validateListing, asyncWrap(listingController.updateListing))
.delete(isLoggedIn, isOwner, asyncWrap(listingController.deleteListing))

// ================= EDIT =================
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.editListing));

module.exports = router;