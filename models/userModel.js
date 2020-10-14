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
  },
  {
    timestamps: true,
  }
);

// Exports model.
module.exports = model("User", userSchema);