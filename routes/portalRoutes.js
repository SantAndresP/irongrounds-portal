/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// User model.
const UserModel = require("../models/userModel.js");
const GameModel = require("../models/gameModel.js");

const { findById } = require("../models/userModel.js");
const { route } = require("./authRoutes.js");
const { search } = require("../app.js");
const { config } = require("dotenv");

/*
 * Profile routes.
 */

// Shows profile page.
router.get("/profile", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const { loggedUser } = req.session;

  if (loggedUser) {
    GameModel.find({ authorId: loggedUser._id })
      .populate("authorId")
      .then((game) => {
        const info = {
          user: game.length ? game[0].authorId : loggedUser,
          game,
        };

        // Checking for user log-in.
        res.locals.isLoggedIn = !!req.session.loggedUser;

        console.log("locals", res.locals);
        res.render("profile", { info });
      });
  } else {
    res.redirect("/login");
  }
});

// Editing profile.
router.get("/profile/edit", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  if (req.session.loggedUser) {
    let user = req.session.loggedUser;
    console.log(user);
    res.render("profile/edit", { user });
  } else {
    res.redirect("/login");
  }
});

router.post("/profile/edit", (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.session.loggedUser._id;

  UserModel.findByIdAndUpdate(id, { $set: req.body }).then(() => {
    console.log("Data was updated successfully.");
    res.redirect("/profile");
  });
});

/*
 * Game routes.
 */

// Game catalog.
router.get("/games", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  GameModel.find().then((games) => {
    res.render("game-catalog", { games });
  });
});

// Uploading a game GET.
router.get("/profile/upload", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  if (req.session.loggedUser) {
    res.render("profile/upload-game");
  } else {
    res.redirect("/login");
  }
});

// Uploading a game POST.
router.post("/profile/upload", (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const { username, _id } = req.session.loggedUser;

  const newGame = {
    author: username,
    authorId: _id,
    ...req.body,
  };

  GameModel.create(newGame).then(() => {
    console.log(req.body);
    console.log("Data was updated successfully.");
    res.redirect("/profile");
  });
});

// Games.
router.get("/games/:gameid", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.gameid;

  GameModel.findById(id).then((data) => {
    res.render("games/game", { data });
  });
});

// Editing game GET.
router.get("/games/:id/edit", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.id;
  const { _id } = req.session.loggedUser;

  GameModel.findById(id).then((game) => {
    if (game.authorId == _id) {
      res.render("profile/edit-game", { game });
    } else {
      res.render("permission-denied");
    }
  });
});

// Editing game POST.
router.post("/games/:id/edit", (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.id;

  GameModel.findByIdAndUpdate(id, { $set: req.body })
    .then(() => {
      console.log("Data was updated successfully.");
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log("Something has gone horribly wrong.", err);
      res.redirect("/error");
    });
});

// Deleting game.
router.post("/games/:id/delete", (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.id;
  const { _id } = req.session.loggedUser;

  GameModel.findById(id).then((game) => {
    if (game.authorId == _id) {
      GameModel.findOneAndDelete(id).then(() => {
        res.redirect("/profile");
      });
    } else {
      res.render("permission-denied");
    }
  });
});

// Search game.
router.get("/search", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const userSearch = req.query.search.toLowerCase();

  GameModel.find()
    .then((gamesList) => {
      console.log(gamesList);

      const searchedGames = gamesList.filter((game) => {
        return game.title.toLowerCase().includes(userSearch);
      });

      return searchedGames;
    })
    .then((games) => {
      res.render("search-result", { games });
    });
});

// Exports routes.
module.exports = router;
