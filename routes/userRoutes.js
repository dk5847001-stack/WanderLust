const express = require("express");
const router = express.Router();

const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrapp");
const ExpressError = require("../ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware");
// ================= REGISTER =================
router.get("/register", (req,res)=>{
    res.render("users/register");
});

// ================= REGISTER =================
router.post("/register", asyncWrap(async (req, res, next)=>{
    try{
    const { email, username, password } = req.body;
    const newUser = new User({ email, username});
    const registeredUser = await User.register(newUser, password);
    console.log("Registered user:", registeredUser);
    req.logIn(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/");
    })
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/register");
    }
}))

router.get("/login", (req, res)=>{
    res.render("users/login");
})

// ================= LOGIN =================

router.post("/login", 
     saveRedirectUrl,
     passport.authenticate("local",
     { failureRedirect: "/login",
       failureFlash: true
     }),
       asyncWrap(async (req, res, next)=>{
       req.flash("success", "Welcome back!");
       res.redirect(res.locals.redirectUrl || "/");
})
);

// ================= LOGOUT =================
router.post("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/login");
    })
})

module.exports = router;