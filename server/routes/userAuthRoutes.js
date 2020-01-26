const path = require('path'),
  express = require('express');
(router = express.Router()),
  (campService = require('../controllers/CampService.js')),
  (userService = require('../controllers/AuthUserService'));

const passport          = require('passport')
const LocalStrategy     = require('passport-local')
const User              = require('../models/UserSchema')
const userMiddleware    = require('../middleware/authUser')
  // passport setup
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Login Middleware


/* Auth Routes */
//register form
router.get("/register", (req, res) => {
  res.render("accounts/user_register");
});

//sign up logic
router.post("/register", (req, res, next) => {
  let password = req.body.password;
  let newUser = new User({ username: req.body.username });
  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("back");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", `Welcome to Yelcamp, ${user.username}`);
      res.redirect("/campgrounds");
    });
  });
});

//login form
router.get("/login", (req, res) => {
  res.render("accounts/user_login");
});
//login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/accounts/login"
  }),
  (req, res) => {
    req.flash("success", "Logged in successfully");
    let redirectionUrl = req.session.redirectUrl || "/campgrounds";
    res.redirect(redirectionUrl);
  }
);

//Logout route
router.get("/logout", (req, res) => {
  // req.session.destroy(); // // won't work with flash
  req.logout();
  req.flash("success", "You've been logged out.");
  res.redirect("/campgrounds");
});
module.exports = router;