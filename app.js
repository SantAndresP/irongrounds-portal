/*
 * Set-up.
 */
require("dotenv").config();

// Imports.
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const app = express();

// Connection to Mongoose.
mongoose
  .connect("mongodb://localhost/irongrounds-portal", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Middleware Set-up.
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// `Express View` engine Set-up.
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Default page title.
app.locals.title = "Express - Generated with IronGenerator";

// Importing `connect-mongo` and `express-session`.
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

app.use(
  session({
    secret: "IronSecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Always in milliseconds.
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // Always in seconds.
    }),
  })
);

/*
 * Routes middleware.
 */
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

/*
 * Port.
 */
module.exports = app;
