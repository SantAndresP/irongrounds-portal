/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// User model.
const UserModel = require("../models/userModel.js");
const { findById } = require("../models/userModel.js");

/*
 * Routes
 */

// Profile
router.get("/profile/:id", (req, res) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then((user) => {
      res.render("profile", { user });
    })
    .catch((err) => {
      console.log("Something has gone horribly wrong.", err);
      res.redirect("/login");
    });
});

// Exports routes.
module.exports = router;
