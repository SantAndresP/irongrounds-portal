/*
 * Game model.
 */

// Imports Mongoose.
const { Schema, model } = require("mongoose");

// Creates game schema.
const gameSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    author: String,
    date: String,
    views: Number,
    score: Number,
    genre: String,
    authorComments: String,
  },
  {
    timestamps: true,
  }
);

// Exports model.
module.exports = model("Game", gameSchema);
