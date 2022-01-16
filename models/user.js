const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods = {
  comparePass(pass) {
    return bcrypt.compare(pass, this.password);
  },
};

module.exports = model("users", UserSchema);
