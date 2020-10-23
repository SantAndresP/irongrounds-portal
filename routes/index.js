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
    const latestUploads = JSON.parse(JSON.stringify(gamesList)).slice(-4);
    const featuredGame = gamesList[4];

    sortedByLikes
      .sort((a, b) => {
        return b.likes.length - a.likes.length;
      })
      .splice(7);

    res.render("index", {
      gamesList,
      sortedByLikes,
      latestUploads,
      featuredGame,
    });
  });
});

module.exports = router;
