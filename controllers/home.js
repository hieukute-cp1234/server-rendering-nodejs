const blogs = require("../models/blog");
const users = require("../models/user");

const home = async (req, res) => {
  const profile = await users.findOne({ _id: req.user });
  const allBlog = await blogs
    .find({ __v: 0 })
    .sort({ _id: -1 })
    .populate("author", ["userName", "email", "avatar"])
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
