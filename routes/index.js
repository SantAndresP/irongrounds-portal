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
  res.render("index");
});

module.exports = router;
