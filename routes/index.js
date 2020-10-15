/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

/*
 * Routes
 */
// Home page.
router.get("/", (req, res, next) => {
// let username = req.session.loggedUser.username
// console.log("outside",username);

//   if (username) {
//     console.log("in if",username);
//     res.render("index", { usernamee });
//   } else {
//     console.log("in else",username);
//     res.render("index", { username: "Hello" });
//   }

  res.render("index");
  // res.render("games/game");
});

module.exports = router;
