const comments = require("../models/comment");
const blogs = require("../models/blog");
const handleError = require("../helpers/response");

const createComments = async (req, res) => {
  try {
    const { content, blog_id } = req.body;

    if (!req.user) {
      return res.status(400).json({ message: "Bạn hãy đăng nhập trước!" });
    }

    if (!content) {
      return res.status(400).json({ message: "success!" });
      // return res.render("home", handleError("Nội dung không được để trống!"));
    }

    if (!blog_id) {
      return res.status(400).json({ message: "success!" });
      // return res.render("home", handleError("Comment phải thuộc một blog!"));
    }

    const newComment = {
      author: req.user,
      content: content,
      blog_id: blog_id,
    };

    const result = await comments.create(newComment);
    await blogs.findOneAndUpdate(
      { _id: blog_id },
      { $push: { comments: result } }
    );
    return res.status(200).json({ message: "sucess!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error!" });
  }
};

const editComment = async (req, res) => {
  try {
    const { author, content, blog_id } = req.body;
    if (!author) {
      return res.render("/", handleError("Không có author!"));
    }

    if (!content) {
      return res.render("/", handleError("Nội dung không được để trống!"));
    }

    if (!blog_id) {
      return res.render("/", handleError("Comment phải thuộc một blog!"));
    }

    if (content.length < 1) {
      return res.render("/", handleError("Nội dung không được để trống!"));
    }

    await comments.findByIdAndUpdate({ _id: req.params.id_comment }, req.body);
    return res.redirect("/");
  } catch (error) {
    return res.render("/", handleError("Server error!"));
  }
};

const delComment = async (req, res) => {
  try {
    await comments.remove({
      _id: req.params.id_comment,
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("/", handleError("Server error!"));
  }
};

module.exports = {
  createComments,
  editComment,
  delComment,
};
