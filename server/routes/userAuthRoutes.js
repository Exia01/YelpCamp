const path = require("path"),
  express = require("express");
(router = express.Router()),
  (campService = require("../controllers/CampService.js")),
  (userService = require("../controllers/AuthUserService"));

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/UserSchema");
const userMiddleware = require("../middleware/authUser");
// passport setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Login Middleware

/* Auth Routes */
//register form
router.get("/register", (req, res) => {
  const tempUserobj = {}; //could implement later
  res.render("accounts/user_register", { tempUserobj:tempUserobj });
});

//sign up logic
router.post("/register",async (req, res, next) => {
  let tempUserobj = {
    ...req.body
  };
  console.log(tempUserobj)
  /** Find if email exists or not */
  const userExists = await User.findOne({
    username: tempUserobj.username
  }).countDocuments();

  if (userExists) {
    /** Set flash message and redirect to signup page */
    req.flash("error", "User Already Exists");
    return res.redirect("back", tempUserobj);
  }

  if (!tempUserobj.username) {
    /** Set flash message and redirect to signup page */
    req.flash("error", "Please provide a username");
    return res.redirect("back");
  }

  let newUser = new User({ username: tempUserobj.username });
  User.register(newUser, tempUserobj.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("back",);
    }
    passport.authenticate("local")(req, res, function() {
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
    failureRedirect: "/accounts/login",
    //custom message
    failureFlash: "Invalid username or password."
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
