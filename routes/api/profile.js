// To use the router you need to bring in express
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load profile model
const Profile = require("../../models/Profiles");
// Load user model
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current user's profile (not using id, as with protected routes we are getting payloads with user's info. You have to be logged in to get the user's info)
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // map to an error - pass that in the errors object (or something from the databse)
    const errors = {}; // initialise

    // Fetch current user's profile
    // req.user.id
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
