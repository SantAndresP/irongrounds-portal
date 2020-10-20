/*
 * User model.
 */

// Imports Mongoose.
const { Schema, model } = require("mongoose");

// Creates user schema.
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ranking: {
      type: String,
      default: "You just joined!",
    },
    about: {
      type: String,
      default: "Please, edit your about!",
    },
    image: {
      type: String,
      default: "https://semantic-ui.com/images/wireframe/square-image.png",
    },
  },
  {
    timestamps: true,
  }
);

// Exports model.
module.exports = model("User", userSchema);
