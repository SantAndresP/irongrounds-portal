/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// Models.
const UserModel = require("../models/userModel.js");
const GameModel = require("../models/gameModel.js");
const CommentModel = require("../models/commentModel.js");

const { findById } = require("../models/userModel.js");
const { route } = require("./authRoutes.js");
const { search, render } = require("../app.js");
const { config } = require("dotenv");

//Cloundinary config
const upload = require("../config/cloudinary.config");
require("../config/cloudinary.config");
const { parser, storage } = require("../config/cloudinary.config");

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
        UserModel.findById({ _id: loggedUser._id }).then((user) => {
          console.log(user, game);
          const info = { user, game };
          res.render("profile", { info });
        });
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
    let loggedUser = req.session.loggedUser;

    UserModel.findById(loggedUser._id).then((user) => {
      res.render("profile/edit", { user });
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/profile/edit", parser.single("image"), (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const loggedUserId = req.session.loggedUser._id;

  UserModel.findByIdAndUpdate(loggedUserId, {
    $set: { image: req.file.path, ...req.body },
  })
    .then((info) => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res
        .status(500)
        .render("profile/edit", { message: "Something went wrong." });
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
router.post("/profile/upload", parser.single("image"), (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const { username, _id } = req.session.loggedUser;

  const newGame = {
    author: username,
    authorId: _id,
    image: req.file.path,
    ...req.body,
  };

  GameModel.create(newGame)
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res
        .status(500)
        .render("profile/upload-game", { message: "Something went wrong." });
    });
});

// Games.
router.get("/games/:gameid", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;
  const id = req.params.gameid;
  let isLikedByUser = false;

  GameModel.findById(id).then((data) => {
    if (data.likes.includes(req.session.loggedUser._id)) {
      isLikedByUser = true;
    }
    CommentModel.findOne({ game: id }).then((opinions) => {
      if (!opinions || opinions.length === 0) {
        console.log(data);
        res.render("games/game", { data, isLikedByUser });
      } else {
        console.log("else", opinions);

        res.render("games/game", { data, opinions, isLikedByUser });
      }
    });
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
router.post("/games/:id/edit", parser.single("image"), (req, res, next) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.id;

  GameModel.findByIdAndUpdate(id, {
    $set: { image: req.file.path, ...req.body },
  })
    .then((game) => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res
        .status(500)
        .render("profile/edit-game", { message: "Something went wrong." });
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
      GameModel.findOneAndRemove(id).then(() => {
        console.log("deleted", id);
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
      const searchedGames = gamesList.filter((game) => {
        return game.title.toLowerCase().includes(userSearch);
      });

      return searchedGames;
    })
    .then((games) => {
      res.render("search-result", { games });
    });
});

// Like.
router.post("/games/:id/like", (req, res, next) => {
  const id = req.params.id;
  const { loggedUser } = req.session;

  if (req.session.loggedUser) {
    GameModel.find({
      $and: [{ likes: { $all: [loggedUser._id] } }, { _id: id }],
    }).then((findResult) => {
      if (findResult.length === 0) {
        GameModel.findByIdAndUpdate(id, { $push: { likes: loggedUser._id } })
          .then(() => {
            res.redirect(`/games/${id}`);
          })
          .catch((err) => {
            console.log("Something has gone horribly wrong.", err);
          });
      } else {
        GameModel.findByIdAndUpdate(id, { $pull: { likes: loggedUser._id } })
          .then(() => {
            res.redirect(`/games/${id}`);
          })
          .catch((err) => {
            console.log("Something has gone horribly wrong.", err);
          });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// Comments.
router.post("/games/:id/comments", (req, res, next) => {
  const id = req.params.id;
  const { loggedUser } = req.session;

  if (req.session.loggedUser) {
    CommentModel.find({ game: id }).then((findResult) => {
      if (findResult.length === 0) {
        const newCommentSection = {
          game: id,
          comments: {
            author: loggedUser.username,
            image: loggedUser.image,
            comment: req.body.comment,
          },
        };

        CommentModel.create(newCommentSection).then(() => {
          res.redirect(`/games/${id}`);
        });
      } else {
        CommentModel.findOneAndUpdate(
          { game: id },
          {
            $push: {
              comments: {
                author: loggedUser.username,
                image: loggedUser.image,
                comment: req.body.comment,
              },
            },
          }
        ).then(() => {
          res.redirect(`/games/${id}`);
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// Public profile.
router.get("/profile/public/:id", (req, res) => {
  // Checking for user log-in.
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const id = req.params.id;

  UserModel.findById(id).then((userInfo) => {
    const { username, image, about } = userInfo;

    GameModel.find({ authorId: id }).then((foundGames) => {
      if (!foundGames || foundGames.length === 0) {
        const info = { username, image, about };
        res.render("profile/public", info);
      } else {
        const info = {
          user: { username, image, about },
          game: foundGames,
        };
        res.render("profile/public", { info });
      }
    });
  });
});

// Exports routes.
module.exports = router;
