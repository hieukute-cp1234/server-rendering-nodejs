const blogs = require("../models/blog");
const users = require("../models/user");

const profilePage = async (req, res) => {
  const profile = await users.findOne({ _id: req.user });
  const allBlogByUser = await blogs
    .find({ author: req.user })
    .populate("author", ["userName", "email"])
    .populate("react", ["reacted", "author"])
    .populate("comments", ["content", "author"]);
  res.render("profile", {
    title: "Profile",
    titlePage: "My Blog",
    user: profile,
    blogList: allBlogByUser,
  });
};

// const profile = async (req, res)=>{
//   try {
//     const {userName}
//   } catch (err) {

//   }
// }

module.exports = profilePage;
