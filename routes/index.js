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
  // const username = req.session.loggedUser.username;

  // if (req.session.loggedUser.username) {
  //   res.render("index", { username });
  // } else {
  //   res.render("index", { username: "Hello" });
  // }

  res.render("index");
});

module.exports = router;
