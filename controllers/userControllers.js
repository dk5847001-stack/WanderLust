const User = require("../models/user");

module.exports.renderRegisterForm = (req,res)=>{
    res.render("users/register");
}

module.exports.createRegisterForm = async (req, res, next)=>{
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
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login");
}

module.exports.createLoginForm = async (req, res, next)=>{
       req.flash("success", "Welcome back!");
       res.redirect(res.locals.redirectUrl || "/");
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/login");
    })
}