/*
 * Comment model.
 */

// Imports Mongoose.
const mongoose = require("mongoose");

// Creates comment schema.
const commentSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      unique: true,
    },

    comments: [
      {
        author: String,
        image: String,
        comment: String,
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Exports model.
module.exports = mongoose.model("Comment", commentSchema);
