const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("../helpers/jwt");
const users = require("../models/user");
const handleError = require("../helpers/response");

const renderRegister = async (req, res) => {
  res.render("register", { title: "Register" });
};

const renderLogin = async (req, res) => {
  res.render("login", { title: "Login" });
};

const register = async (req, res) => {
  try {
    const { email, password, userName, confirmPassword } = req.body;

    if (!email) {
      return res.render(
        "register",
        handleError("Vui lòng nhập email của bạn!")
      );
    }

    if (!password) {
      return res.render(
        "register",
        handleError("Password không được để trống!")
      );
    }

    if (!validator.isEmail(email)) {
      return res.render(
        "register",
        handleError(`${email} không phải là email!`)
      );
    }

    if (password.length < 6) {
      return res.render(
        "register",
        handleError("Password lớn hoặc bằng 6 kí tự!")
      );
    }

    if (password !== confirmPassword) {
      return res.render(
        "register",
        handleError("Xác nhận password không đúng")
      );
    }

    const checkEmail = await users.findOne({ email });

    if (checkEmail) {
      return res.render("register", handleError(`Email ${email} đã tồn tại!`));
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const handlePass = bcrypt.hashSync(password, salt);

    const newUser = {
      email: email,
      password: handlePass,
      userName: userName || email.split("@")[0],
    };
    const result = await users.create(newUser);
    return res.render("register", {
      success: `Đăng kí email ${result.email} thành công!`,
    });
  } catch (error) {
    return res.render("register", handleError("Server error!"));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.render("login", handleError("Vui lòng nhập email của bạn!"));
    }

    if (!password) {
      return res.render("login", handleError("Password không được để trống!"));
    }

    if (!validator.isEmail(email)) {
      return res.render("login", handleError(`${email} không phải là email!`));
    }

    if (password.length < 6) {
      return res.render(
        "login",
        handleError("Password lớn hoặc bằng 6 kí tự!")
      );
    }

    const checkEmail = await users.findOne({ email });
    if (!checkEmail) {
      return res.render("login", handleError(`Email ${email} không tồn tại!`));
    }

    const checkPassword = await checkEmail.comparePass(password);
    if (!checkPassword) {
      return res.render("login", handleError("Mật khẩu vừa nhập không đúng!"));
    }

    const token = await JWT.generateToken(checkEmail._id);
    res.cookie("token", token);

    return res.redirect("/");
  } catch (error) {
    return res.render("login", handleError("Server error!"));
  }
};

module.exports = {
  renderLogin,
  renderRegister,
  login,
  register,
};
