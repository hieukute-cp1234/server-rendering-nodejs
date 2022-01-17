const blogs = require("../models/blog");
const users = require("../models/user");

const home = async (req, res) => {
  const profile = await users.findOne({ _id: req.user });
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
