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

/*
 * Routes
 */

// Shows profile page.
router.get("/profile", (req, res) => {
  if (req.session.loggedUser) {
    const id = req.session.loggedUser._id;

    GameModel.find({ authorId: id })
      .populate("User")
      .then((game) => {
        UserModel.findById(id).then((user) => {
          console.log(user, game);
          const info = { user, game };
          res.render("profile", { info });
        });
      });

    // UserModel.findById(id).then((user) => {
    //   res.render("profile", { user });
    // });
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

// Uploading a game.
router.get("/profile/upload", (req, res) => {
  if (req.session.loggedUser) {
    res.render("profile/upload-game");
  } else {
    res.redirect("/login");
  }
});

router.post("/profile/upload", (req, res, next) => {
  const { title, about, link, image, width, height } = req.body;
  const { username, _id } = req.session.loggedUser;

  const newGame = {
    author: username,
    authorId: _id,
    title,
    about,
    link,
    image,
    width,
    height,
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

// Editing game.
router.get("/games/:id/edit", (req, res) => {
  const id = req.params.id;
  const { username, _id } = req.session.loggedUser;

  GameModel.findById(id).then((game) => {
    if (game.authorId == _id) {
      res.render("profile/edit-game", { game });
    } else {
      res.render("permission-denied");
    }
  });
});

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

// Exports routes.
module.exports = router;
