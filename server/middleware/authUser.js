//Login Middleware
const Campground = require("../models/CampSchema");
const Comment = require("../models/CommentSchema");

var userMiddleware = {};

// checks if user is logged in
userMiddleware.isLoggedIn = (req, res, next) => {
  console.log(req)
  if (req.isAuthenticated()) {
    return next();
  }
  // console.log(req.headers.referer)
  // console.log(req.url)
  req.session.redirectUrl = req.originalUrl;
  req.flash("error", "To continue, please log in");
  return res.redirect("/accounts/login");
};

//checks for author of campground
userMiddleware.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params._id, function(err, foundCampground) {
      if (err || !foundCampground) {
        console.log(err);
        req.flash("error", "Sorry, that campground does not exist!");
        res.redirect("/campgrounds");
      } else if (
        foundCampground.author.id.equals(req.user._id) ||
        req.user.isAdmin
      ) {
        req.campground = foundCampground;
        next();
      } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  } else {
    req.flash("error", "Sorry, you need to be logged in to do that");
    res.redirect("back");
  }
};

// checks for author of comment
userMiddleware.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};
module.exports = userMiddleware;
