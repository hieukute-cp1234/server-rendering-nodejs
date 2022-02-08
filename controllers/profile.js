const blogs = require("../models/blog");
const users = require("../models/user");
const handleError = require("../helpers/response");

const profilePage = async (req, res) => {
  const profile = await users.findOne(
    { _id: req.user },
    { password: 0, updatedAt: 0, _id: 0, __v: 0 }
  );
  if (!profile) {
    return res.redirect("/");
  }
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
    isOwner: true,
  });
};

const profileByUser = async (req, res) => {
  const userId = req.params.user_id;
  const profileOwner = await users.findOne(
    { _id: req.user },
    { password: 0, updatedAt: 0, _id: 0, __v: 0 }
  );
  const profile = await users.findOne(
    { _id: userId },
    { password: 0, updatedAt: 0, _id: 0, __v: 0 }
  );
  const allBlogByUser = await blogs
    .find({ author: userId })
    .populate("author", ["userName", "email"])
    .populate("react", ["reacted", "author"])
    .populate("comments", ["content", "author"]);

  res.render("profileByUser", {
    title: `${profile.userName}`,
    titlePage: `Page of ${profile.userName}`,
    userList: profile,
    user: profileOwner,
    blogList: allBlogByUser,
  });
};

const profile = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (email) {
      return res.render(
        "profile",
        handleError("Bạn không được phép đổi email!")
      );
    }

    if (!Number(phone)) {
      return res.render("profile", handleError("Phone phải là số!"));
    }

    await users.findOneAndUpdate({ _id: req.user }, req.body);
    return res.redirect("/profile");
  } catch (err) {
    return res.render("profile", handleError(err));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, newPassword, confirmNewPassword } = req.body;
    if (!password) {
      return res.render(
        "profile",
        handleError("Password không được để trống!")
      );
    }

    if (!newPassword) {
      return res.render("profile", handleError("Không có password mới!"));
    }

    if (!confirmNewPassword) {
      return res.render("profile", handleError("Chưa xác nhận password mới!"));
    }
    const checkUser = await users.findOne({ _id: req.user });
    const checkPass = await checkUser.comparePass(password);
    if (!checkPass) {
      return res.render(
        "profile",
        handleError("Password vừa nhập không đúng!")
      );
    }

    if (newPassword.length > 0) {
      return res.render(
        "profile",
        handleError("Password không được nhỏ hơn 6 kí tự!")
      );
    }

    if (newPassword !== confirmNewPassword) {
      return res.render("profile", handleError("Không trùng password mới!"));
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const handlePass = bcrypt.hashSync(newPassword, salt);

    await users.findOneAndUpdate({ _id: req.user }, { password: handlePass });

    return res.render("profile", {
      success: "Đổi pass thành công!",
    });
  } catch (err) {
    return res.render("profile", handleError(err));
  }
};

module.exports = {
  resetPassword,
  profilePage,
  profile,
  profileByUser,
};
