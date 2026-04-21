const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookiesParser = require("cookie-parser");

// ================= ROUTES =================
const listingRoutes = require("./routes/listingRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ================= APP INIT =================
const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ================= DB CONNECTION =================
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.log("❌ DB Connection Error:", err);
    }
}
connectDB();

app.use(cookiesParser()); // For handling cookies (if needed in the future)

// ================= APP CONFIG =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ================= MIDDLEWARE =================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// 🔍 Request Logger (useful for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

// ================= ROUTES =================

// Home
app.get("/", (req, res) => {
    res.render("home");
});

// Listings
app.use("/listings", listingRoutes);

// Reviews (nested route - professional structure)
app.use("/listings/:id/reviews", reviewRoutes);

// Subscriber
app.use("/subscriber", subscriberRoutes);

// Message
app.use("/message", messageRoutes);

// ================= 404 HANDLER =================
app.use((req, res, next) => {
    res.status(404).render("assets/404");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(", ");
        status = 400;
    }

    // Joi Validation Error
    if (err.details && Array.isArray(err.details)) {
    message = err.details.map(e => e.message).join(", ");
    status = 400;
}

    res.status(status).render("assets/error", { message });
});

// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});