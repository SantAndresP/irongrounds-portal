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

    const sortedByLikes = JSON.parse(JSON.stringify(gamesList));

    sortedByLikes
      .sort((a, b) => {
        return b.likes.length - a.likes.length;
      })
      .splice(7);

    console.log("SORTED: ", sortedByLikes);
    // console.log("NOT SORTED: ", gamesList);

    res.render("index", { gamesList, sortedByLikes });
  });
});

module.exports = router;
