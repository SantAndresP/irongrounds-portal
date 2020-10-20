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
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  res.render("auth/signup", { layout: false });
});

// Log-in.
router.get("/login", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  res.render("auth/login", { layout: false });
});

// Sign-up post.
router.post("/signup", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const { username, password } = req.body;

  bcrypt.genSalt(10).then((salt) => {
    bcrypt
      .hash(password, salt)
      .then((hashedPass) => {
        UserModel.create({ username, password: hashedPass }).then((user) => {
          req.session.loggedUser = user;
          res.redirect("/");
        });
      })
      .catch(() => {
        res.status(500).render("auth/login", {
          errorMessage:
            "Something went wrong. Try again or speak to the Ironmaster.",
          layout: false,
        });
      });
  });
});

// Log-in post.
router.post("/login", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const { username, password } = req.body;

  UserModel.findOne({ username: username }).then((data) => {
    bcrypt
      .compare(password, data.password)
      .then((result) => {
        if (result) {
          // I'm not sure what this is doing.
          req.session.loggedUser = data;
          res.locals.loggedIn = req.session.loggedUser;

          // Checking for user log-in.
          res.locals.isLoggedIn = !!req.session.loggedUser;

          res.redirect("/profile");
        } else {
          res.status(500).render("auth/login", {
            errorMessage: "Passwords do not match.",
            layout: false,
          });
        }
      })
      .catch(() => {
        res.status(500).render("auth/login", {
          errorMessage:
            "Something went wrong. Try again or speak to the Ironmaster.",
          layout: false,
        });
      });
  });
});

// Log-out.
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Exports routes.
module.exports = router;
