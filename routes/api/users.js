// To use the router you need to bring in express
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");

// Load user model
const User = require("../../models/User");

// const mongoose = require("mongoose");
// mongoose.set("useFindAndModify", false);

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  // Use mongoose to first find if the user (findOne) exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists."
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt
      .compare(password, user.password) // user.password is the stored hashed password
      .then(isMatch => {
        if (isMatch) {
          // res.json({ msg: "Success" });
          // User matched

          // Create payload - payload of what will be included in the token
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
  });
});

module.exports = router;
