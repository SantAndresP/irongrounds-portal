/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// User model.
const UserModel = require("../models/User.model");

/*
 * Routes
 */
// Sign up.
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  bcrypt.genSalt(10).then((salt) => {
    bcrypt
      .hash(password, salt)
      .then((hashedPass) => {
        UserModel.create({ username, password: hashedPass });
      })
      .then(() => {
        res.redirect("/");
      });
  });
});
