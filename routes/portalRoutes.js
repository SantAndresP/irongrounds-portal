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

/*
 * Profile routes.
 */

// Shows profile page.
router.get("/profile", (req, res) => {
  const { loggedUser } = req.session;

  if (loggedUser) {
    GameModel.find({ authorId: loggedUser._id })
      .populate("authorId")
      .then((game) => {
        const info = {
          user: game.length ? game[0].authorId : loggedUser,
          game,
        };

        res.render("profile", { info });
      });
  } else {
    res.redirect("/login");
  }
});

// router.get("/profile/:id", (req, res) => {
//   const id = req.params.id;

//   UserModel.findById(id)
//     .then((user) => {
//       res.render("profile", { user });
//     })
//     .catch((err) => {
//       console.log("Something has gone horribly wrong.", err);
//       res.redirect("/login");
//     });
// });

// Editing profile.
router.get("/profile/edit", (req, res) => {
  if (req.session.loggedUser) {
    res.render("profile/edit");
  } else {
    res.redirect("/login");
  }
});

router.post("/profile/edit", (req, res, next) => {
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
  GameModel.find().then((games) => {
    res.render("game-catalog", { games });
  });
});

// Uploading a game.
router.get("/profile/upload", (req, res) => {
  if (req.session.loggedUser) {
    res.render("profile/upload-game");
  } else {
    res.redirect("/login");
  }
});

router.post("/profile/upload", (req, res, next) => {
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
  const id = req.params.gameid;

  GameModel.findById(id).then((data) => {
    res.render("games/game", { data });
  });
});

// Editing game GET.
router.get("/games/:id/edit", (req, res) => {
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

// Search game
router.get("/search", (req, res) => {
  const userInput = req.query.search;
  console.log(userInput);
  
  GameModel.find({ $text: { $search: /userInput/i } })
    .then(games => {
      console.log("In find", games);
      res.render("search-result", { games });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Exports routes.
module.exports = router;
