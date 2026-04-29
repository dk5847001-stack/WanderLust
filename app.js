require("dotenv").config();

console.log("ENV CHECK", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookiesParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { error } = require("console");

const User = require("./models/user.js");
const { isLoggedIn } = require("./middleware/middleware");
const listingRoutes = require("./routes/listingRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log("DB Connection Error:", err);
    }
}

connectDB();

app.use(cookiesParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE:", error);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/subscriber", subscriberRoutes);
app.use("/message", messageRoutes);
app.use("/", userRoutes);

app.use((req, res, next) => {
    res.status(404).render("assets/404");
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;

    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
        status = 400;
    }

    if (err.details && Array.isArray(err.details)) {
        message = err.details.map((e) => e.message).join(", ");
        status = 400;
    }

    res.status(status).render("assets/error", { message });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
