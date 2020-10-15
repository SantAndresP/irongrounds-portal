/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// User model.
const UserModel = require("../models/userModel.js");

/*
 * Routes
 */
// Sign-up.
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Log-in.
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Sign-up post.
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

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

// Log-in post.
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username: username }).then((data) => {
    bcrypt
      .compare(password, data.password)
      .then((result) => {
        if (result) {
          // I'm not sure what this is doing.
          req.session.loggedUser = data;

          const userId = req.session.loggedUser._id;

          console.log(req.session.loggedUser);

          res.redirect(`/profile/${userId}`);
        } else {
          res
            .status(500)
            .render("auth/login", { error: "Passwords do not match." });
        }
      })
      .catch((err) => {
        // console.log(err);
        res
          .status(500)
          .render("auth/login", { error: "Something went wrong. Try again." });
      });
  });
});

// Log-out.
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.locals.showFox = false;
  res.redirect("/");
});

// Exports routes.
module.exports = router;
