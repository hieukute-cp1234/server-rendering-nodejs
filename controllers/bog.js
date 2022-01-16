const blogs = require("../models/blog");
const users = require("../models/user");
const reacts = require("../models/react");
const comments = require("../models/comment");
const handleError = require("../helpers/response");

const fetchBlogByUser = async (req, res) => {
  try {
    const idUser = req.params.id_user;
    if (!idUser) {
      return res.json(response(null, "Unavailable params!"));
    }

    const existUser = await users.findOne({ _id: idUser });
    if (!existUser) {
      return res.status(402).json(response(null, "User not found"));
    }

    const blogOfUser = await blog.find({ author: idUser });
    return res.status(200).json(response(blogOfUser, "get blog success"));
  } catch (error) {
    return res.status(500).json(response(null, error));
  }
};

const createBlog = async (req, res) => {
  try {
    const { content, image, author } = req.body;
    if (!content) {
      return res.render("/create-blog", handleError("Blog no content!"));
    }

    if (!author) {
      return res.render("/create-blog", handleError("Blog must have author!"));
    }

    const newBlog = {
      author: author,
      content: content,
      image: image,
      react: [],
      comments: [],
    };

    await blogs.create(newBlog);
    return res.redirect("/");
  } catch (err) {
    return res.render("/create-blog", handleError("Server error!"));
  }
};

const editBlog = async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content) {
      return res.render("/create-blog", handleError("Blog no content!"));
    }

    if (!author) {
      return res.render("/create-blog", handleError("Blog must have author!"));
    }

    await blogs.findByIdAndUpdate({ _id: req.params.id_blog }, req.body);

    return res.redirect("/");
  } catch (error) {
    return res.render("/create-blog", handleError("Server error!"));
  }
};

const deleteBlog = async (req, res) => {
  try {
    await blogs.deleteOne({ _id: req.params.id_blog });
    await comments.deleteMany({ blog_id: req.params.id_blog });
    await reacts.deleteMany({ blog_id: req.params.id_blog });
    return res.redirect("/");
  } catch (error) {
    return res.render("/create-blog", handleError("Server error!"));
  }
};

module.exports = {
  createBlog,
  editBlog,
  deleteBlog,
};
