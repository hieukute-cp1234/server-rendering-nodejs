const sharp = require("sharp");
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
    .sort({ _id: -1 })
    .populate("author", ["userName", "email", "avatar"])
    .populate("react", ["reacted", "author"])
    .populate({
      path: "comments",
      populate: { path: "author", select: ["userName", "avatar"] },
    });

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
    .sort({ _id: -1 })
    .populate("author", ["userName", "email", "avatar"])
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
    let nameAvatar = null;
    if (req.file) {
      nameAvatar = req.file.fieldname + "-" + req.file.filename + ".jpg";

      sharp(req.file.path)
        .resize(300, 300)
        .toFile("static/image/" + nameAvatar, function (err, file) {
          if (err) {
            console.log("error", err);
          }
        });
    }

    if (email) {
      return res.render(
        "profile",
        handleError("B???n kh??ng ???????c ph??p ?????i email!")
      );
    }

    if (!Number(phone)) {
      return res.render("profile", handleError("Phone ph???i l?? s???!"));
    }

    const currentAvatar = await users.findOne({ _id: req.user });

    const newValue = {
      ...req.body,
      avatar: nameAvatar || currentAvatar.avatar,
    };
    await users.findOneAndUpdate({ _id: req.user }, newValue);
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
        handleError("Password kh??ng ???????c ????? tr???ng!")
      );
    }

    if (!newPassword) {
      return res.render("profile", handleError("Kh??ng c?? password m???i!"));
    }

    if (!confirmNewPassword) {
      return res.render("profile", handleError("Ch??a x??c nh???n password m???i!"));
    }
    const checkUser = await users.findOne({ _id: req.user });
    const checkPass = await checkUser.comparePass(password);
    if (!checkPass) {
      return res.render(
        "profile",
        handleError("Password v???a nh???p kh??ng ????ng!")
      );
    }

    if (newPassword.length > 0) {
      return res.render(
        "profile",
        handleError("Password kh??ng ???????c nh??? h??n 6 k?? t???!")
      );
    }

    if (newPassword !== confirmNewPassword) {
      return res.render("profile", handleError("Kh??ng tr??ng password m???i!"));
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const handlePass = bcrypt.hashSync(newPassword, salt);

    await users.findOneAndUpdate({ _id: req.user }, { password: handlePass });

    return res.render("profile", {
      success: "?????i pass th??nh c??ng!",
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
