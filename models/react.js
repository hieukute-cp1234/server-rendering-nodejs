const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ReactSchema = new Schema({
  reacted: {
    type: Boolean,
  },
  blog: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "blogs",
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

module.exports = model("reactions", ReactSchema);
