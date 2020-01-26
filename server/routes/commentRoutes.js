const express = require("express");
(router = express.Router({ mergeParams: true })),
  (campService = require("../controllers/CampService.js")),
  (usrMware = require("../middleware/authUser.js"));

/* could import middleware and rename the authUser.js to index.js due to it being a default. */

//comments new
router.get("/new", usrMware.isLoggedIn, (req, res) => {
  campService
    .camp_show(req)
    .then(campground => {
      res.render("comments/comment_new", { campground: campground });
    })
    .catch(err => {
      console.log("ERROR: ", err);
      res.redirect("/campgrounds");
    });
});

//comments new
router.post("/new", usrMware.isLoggedIn, (req, res) => {
  campService
    .comment_new(req)
    .then(campground => {
      req.flash("success", "Successfully created comment");
      let id = campground._id;
      res.redirect(`/campgrounds/${id}`);
    })
    .catch(err => {
      console.log("ERROR: ", err);
      res.redirect("/campgrounds");
    });
});

//comment update form
router.get(
  "/:comment_id/edit",
  usrMware.isLoggedIn,
  usrMware.checkCommentOwnership,
  (req, res) => {
    campService
      .comment_show(req)
      .then(data => {
        let campground = data[0];
        let comment = data[1];
        res.render("comments/comment_edit", {
          campground: campground,
          comment: comment
        });
      })
      .catch(err => {
        console.log("ERROR: ", err);
        res.redirect("/campgrounds");
      });
  }
);

//comment update
router.put(
  "/:comment_id/edit",
  usrMware.isLoggedIn,
  usrMware.checkCommentOwnership,
  (req, res) => {
    let id = req.params._id;
    campService
      .comment_update(req)
      .then(comment => {
        req.flash("success", "Successfully updated comment");
        res.redirect(`/campgrounds/${id}`);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        res.redirect("/campgrounds");
      });
  }
);

//delete route
router.delete(
  "/:comment_id/delete",
  usrMware.isLoggedIn,
  usrMware.checkCommentOwnership,
  (req, res) => {
    let id = req.params._id;
    campService
      .comment_delete(req)
      .then(comment => {
        // console.log(comment)
        res.redirect(`/campgrounds/${id}`);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        res.redirect(`/campgrounds/${id}`);
      });
  }
);

module.exports = router;
