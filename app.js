const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
const Subscriber = require("./models/subscriber.js");
const Message = require("./models/message.js");
const Review = require("./models/review.js");

const asyncWrap = require("./utils/asyncWrapp.js");
const ExpressError = require("./ExpressError.js");
const { listingSchema } = require("./schema.js");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ================= DB CONNECTION =================
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));

// ================= APP CONFIG =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ================= MIDDLEWARE =================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// request logger
app.use((req, res, next) => {
    req.time = new Date().toLocaleString();
    console.log(req.time, req.method, req.url);
    next();
});

// ================= VALIDATION =================
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, msg));
    }

    next();
};

// ================= HOME =================
app.get("/", (req, res) => {
    res.render("home");
});

// ================= LISTINGS ROUTES =================

// INDEX
app.get("/listings", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// NEW
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// CREATE
app.post("/listings", validateListing, asyncWrap(async (req, res) => {

    const listingData = req.body.listing;

    if (!listingData) {
        throw new ExpressError(400, "Invalid listing data");
    }

    if (!listingData.image?.url?.trim()) {
        listingData.image = {
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"
        };
    }

    await Listing.create(listingData);

    res.redirect("/listings");
}));

// SHOW
app.get("/listings/:id", asyncWrap(async (req, res) => {
    const listings = await Listing.findById(req.params.id).populate("reviews");

    if (!listings) {
        throw new ExpressError(404, "Listing not found");
    }

    // ⭐ Average Rating
    let avgRating = 0;
    if (listings.reviews.length > 0) {
        avgRating =
            listings.reviews.reduce((acc, r) => acc + r.rating, 0) /
            listings.reviews.length;
    }

    res.render("listings/show", { listings, avgRating });
}));

// EDIT
app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { listing });
}));

// UPDATE
app.put("/listings/:id", validateListing, asyncWrap(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, {
        ...req.body.listing
    });

    res.redirect("/listings");
}));

// DELETE
app.delete("/listings/:id", asyncWrap(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));

// ================= SUBSCRIBER ROUTES =================

// CREATE
app.post("/subscriber", asyncWrap(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ExpressError(400, "Email is required");
    }

    await Subscriber.create({ email });
    res.redirect("/subscriber");
}));

// READ ALL
app.get("/subscriber", asyncWrap(async (req, res) => {
    const subscriber = await Subscriber.find({});
    res.render("subscriber/subscriber", { subscriber });
}));

// EDIT
app.get("/subscriber/:id/edit", asyncWrap(async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);
    res.render("subscriber/edit", { subscriber });
}));

// UPDATE
app.put("/subscriber/:id", asyncWrap(async (req, res) => {
    await Subscriber.findByIdAndUpdate(req.params.id, {
        email: req.body.email
    });

    res.redirect("/subscriber");
}));

// DELETE
app.delete("/subscriber/:id", asyncWrap(async (req, res) => {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.redirect("/subscriber");
}));

// ================= MESSAGE ROUTES =================

// FORM
app.get("/message", (req, res) => {
    res.render("message/message");
});

// CREATE
app.post("/message", asyncWrap(async (req, res) => {
    await Message.create(req.body);
    res.redirect("/message/read");
}));

// READ
app.get("/message/read", asyncWrap(async (req, res) => {
    const messages = await Message.find({});
    res.render("message/adminMessage", { messages });
}));

// EDIT
app.get("/message/:id/edit", asyncWrap(async (req, res) => {
    const message = await Message.findById(req.params.id);
    res.render("message/edit", { message });
}));

// UPDATE
app.put("/message/:id", asyncWrap(async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/message/read");
}));

// DELETE
app.delete("/message/:id", asyncWrap(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/message/read");
}));

// ================== Reviews Routes ==================
app.post("/listings/:id/reviews", asyncWrap(async (req, res) => {
    const listings = await Listing.findById(req.params.id);

    const review = new Review(req.body.review);

    await review.save();
    listings.reviews.push(review);
    await listings.save();

    res.redirect(`/listings/${req.params.id}`);
}));

app.delete("/listings/:id/reviews/:reviewId", asyncWrap(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


// ================= 404 =================
app.use((req, res) => {
    res.status(404).render("assets/404");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;

    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(", ");
        status = 400;
    }

    if (err.details) {
        message = err.details.map(e => e.message).join(", ");
        status = 400;
    }

    res.status(status).render("assets/error", { message });
});

// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});