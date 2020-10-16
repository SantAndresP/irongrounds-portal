/*
 * Game model.
 */

// Imports Mongoose.
const mongoose = require("mongoose");

// Creates game schema.
const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      text: true,
    },

    author: {
      type: String,
      required: true,
      text: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    link: {
      type: String,
      required: true,
      unique: true,
    },

    width: {
      type: String,
      required: true,
    },

    height: {
      type: String,
      required: true,
    },

    about: String,

    image: {
      type: String,
      default: "https://semantic-ui.com/images/wireframe/square-image.png",
    },

    // date: String,
    // views: Number,
    // score: Number,
    // genre: String,
    // authorComments: String,
  },
  {
    timestamps: true,
  }
);

// Exports model.
module.exports = mongoose.model("Game", gameSchema);
