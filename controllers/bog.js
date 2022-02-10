const blogs = require("../models/blog");
const users = require("../models/user");
const reacts = require("../models/react");
const comments = require("../models/comment");
const handleMessage = require("../helpers/response");

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
    const { content, image } = req.body;
    if (!content) {
      return res
        .status(400)
        .json(handleMessage("Hãy chia sẻ những cảm nhận của bạn!"));
    }

    const newBlog = {
      author: req.user,
      content: content,
      image: image || "",
      react: [],
      comments: [],
    };

    await blogs.create(newBlog);
    return res.status(200).json(handleMessage("Blog được tạo!"));
  } catch (err) {
    return res.status(500).json(handleMessage("Eerver error!"));
  }
};

const editBlog = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json(handleMessage("Không có nội dung!"));
    }

    await blogs.findByIdAndUpdate({ _id: req.params.id_blog }, req.body);

    return res.status(200).json(handleMessage("Sửa thành công!"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(handleMessage("Server error!"));
  }
};

const deleteBlog = async (req, res) => {
  try {
    await blogs.deleteOne({ _id: req.params.id_blog });
    await comments.deleteMany({ blog_id: req.params.id_blog });
    await reacts.deleteMany({ blog_id: req.params.id_blog });
    return res.status(200).json(handleMessage("Xóa blog thành công!"));
  } catch (error) {
    return res.status(500).json(handleMessage("Eerver error!"));
  }
};

module.exports = {
  createBlog,
  editBlog,
  deleteBlog,
};
