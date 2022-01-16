const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  blog_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "blogs",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("comments", CommentSchema);
