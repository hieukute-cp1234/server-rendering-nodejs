const reacts = require("../models/react");
const blogs = require("../models/blog");
const response = require("../helpers/response");

const handleReact = async (req, res) => {
  try {
    const { reacted, blog, author } = req.body;
    if (!author) {
      return res.render("/", handleError("Không có author!"));
    }

    if (!blog) {
      return res.render("/", handleError("Comment phải thuộc một blog!"));
    }

    const reaction = await reacts.findOne({
      $and: [{ author: author }, { blog: blog }],
    });

    if (reaction) {
      await reacts.findOneAndDelete({ _id: reaction._id });
      return res.render("/", handleError("Quit reacting!"));
    }

    const newReact = {
      blog: blog,
      author: author,
      reacted: reacted,
    };

    const result = await reacts.create(newReact);
    await blogs.findOneAndUpdate({ _id: blog }, { $push: { react: result } });
    return res.redirect("/");
  } catch (error) {
    return res.render("/", handleError("Server error!"));
  }
};

module.exports = {
  handleReact,
};
