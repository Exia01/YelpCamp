const express = require("express");
(router = express.Router()),
  // (router = require('express-promise-router')()),
  (campService = require("../controllers/CampService")),
  (usrMiddleware = require("../middleware/authUser.js"));

// const asyncMiddleware = fn =>
// (req, res, next) => {
//   Promise.resolve(fn(req, res, next))
//     .catch(next);
// };
//landing
router.get("/", (req, res) => {
  res.render("camp_landing");
});

//index
router.get("/campgrounds", (req, res) => {
  campService
    .camp_index()
    .then(campgrounds => {
      console.log(res.locals);
      res.render("campgrounds/camp_index", { campgrounds: campgrounds });
    })
    .catch(err => {
      console.log("ERROR: ", err);
      res.render("campgrounds/camp_index");
    });
});

// create form
router.get("/campgrounds/new", usrMiddleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/camp_new");
});

//create
router.post("/campgrounds", usrMiddleware.isLoggedIn, (req, res) => {
  campService
    .camp_new(req)
    .then(campground => {
      console.log("From then section:", campground);
      res.redirect("/campgrounds");
    })
    .catch(e => {
      if (e.name === "MongoError" && e.code === 11000) {
        console.log("Duplicate key", [e.message]);
      }
      // console.log(Object.values(e))
      console.log(e.errors);
      //  let obj = Object.values(e.name[1])
      //     for (let err of obj) {
      //       // req.flash("error", err)
      //       console.log(err)
      //     }
      res.redirect("/campgrounds/new");
    });
});

//show
router.get("/campgrounds/:_id", (req, res) => {
  campService
    .camp_show(req)
    .then(campground => {
      // console.log(campground)
      res.render("campgrounds/camp_show", { campground: campground });
    })
    .catch(err => {
      console.log("ERROR: ", err);
      req.flash("error", "Sorry, we could not find the campground");
      res.redirect("/campgrounds");
    });
});

//Edit
router.get(
  "/campgrounds/:_id/edit",
  usrMiddleware.checkCampgroundOwnership,
  (req, res) => {
    campService
      .camp_show(req)
      .then(campground => {
        res.render("campgrounds/camp_edit", { campground: campground });
      })
      .catch(err => {
        // console.log('ERROR: ', err.message);

        res.redirect("/campgrounds");
      });
  }
);

//update
router.put(
  "/campgrounds/:_id/edit",
  usrMiddleware.isLoggedIn,
  usrMiddleware.checkCampgroundOwnership,
  (req, res) => {
    campService
      .camp_update(req)
      .then(campground => {
        id = campground._id;
        // console.log(id)
        res.redirect(`/campgrounds/${id}`);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        res.redirect("/campgrounds", {});
      });
  }
);

router.delete(
  "/campgrounds/:_id/delete",
  usrMiddleware.isLoggedIn,
  usrMiddleware.checkCampgroundOwnership,
  (req, res) => {
    campService
      .camp_delete(req)
      .then(comment => {
        // console.log(comment)
        res.redirect(`/campgrounds`);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        res.redirect("/campgrounds", {});
      });
  }
);
//Destroy or "Delete"

module.exports = router;

//implemented: https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
//info: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
