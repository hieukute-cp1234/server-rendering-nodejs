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
    default: "",
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    default: "",
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  work: {
    type: String,
    trim: true,
    default: "",
  },
  company: {
    type: String,
    trim: true,
    default: "",
  },
  school: {
    type: String,
    trim: true,
    default: "",
  },
  birthDay: {
    type: String,
    trim: true,
    default: "",
  },
  hobby: {
    type: String,
    trim: true,
    default: "",
  },
  gifted: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  martial: {
    type: String,
  },
  sex: {
    type: String,
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
