const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PostSchema = new Schema({
  content: {
    type: String,
    trim: true,
    minLength: 1,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  react: [
    {
      type: Schema.Types.ObjectId,
      ref: "reactions",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("blogs", PostSchema);
