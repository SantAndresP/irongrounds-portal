/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

const UserModel = require("../models/userModel.js");
const GameModel = require("../models/gameModel.js");

/*
 * Routes
 */

// Home page.
router.get("/", (req, res, next) => {
  GameModel.find().then((gamesList) => {
    // Checking for user log-in.
    res.locals.isLoggedIn = !!req.session.loggedUser;

    res.render("index", { gamesList });
  });
});

module.exports = router;
