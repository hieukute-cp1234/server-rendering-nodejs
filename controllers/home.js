const blogs = require("../models/blog");
const users = require("../models/user");
const comments = require("../models/comment");
const reacts = require("../models/react");

const home = async (req, res) => {
  const profile = await users.findOne({ _id: req.user });
  const allComment = await comments.find({});
  const allReact = await reacts.find({});
  const allBlog = await blogs
    .find({})
    .populate("author", ["userName", "email"])
    .populate("react", ["reacted", "author"])
    .populate("comments", ["content", "author"]);
  res.render("home", {
    title: "Home Page",
    titlePage: "Blogs",
    user: profile,
    blogList: allBlog,
  });
};

module.exports = home;
