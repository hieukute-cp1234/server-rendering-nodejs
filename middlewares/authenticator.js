const JWT = require("../helpers/jwt");

const verifyTken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.user = null;
      next();
      return;
    }

    const dataUser = await JWT.verityToken(token);
    req.user = dataUser.data;
    next();
  } catch (error) {
    return res.status(500).redirect("/login");
  }
};

module.exports = verifyTken;
