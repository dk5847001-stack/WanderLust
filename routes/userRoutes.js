const express = require("express");
const router = express.Router();

const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware");
const userController = require("../controllers/userControllers");

// ================= REGISTER =================
router.route("/register")
.get(userController.renderRegisterForm)
.post(asyncWrap(userController.createRegisterForm))

// ================= LOGIN =================
router.route("/login")
.get(userController.renderLoginForm)
.post( 
     saveRedirectUrl,
     passport.authenticate("local",
     { failureRedirect: "/login",
       failureFlash: true
     }),
       asyncWrap(userController.createLoginForm)
)

// ================= LOGOUT =================
router.post("/logout", userController.logout)

module.exports = router;