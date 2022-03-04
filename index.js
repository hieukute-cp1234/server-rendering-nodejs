const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cookies = require("cookie-parser");
const router = express.Router();
const auththenticator = require("./middlewares/authenticator");
const homePage = require("./controllers/home");
const profileController = require("./controllers/profile");
const authController = require("./controllers/login");
const blogController = require("./controllers/bog");
const commentController = require("./controllers/comment");
const reactController = require("./controllers/react");

const SERVER = {
  PORT: 8000,
  DB_KEY: "mongodb://127.0.0.1:27017/blog_database_dev",
};

const connectDatabase = async () => {
  try {
    await mongoose.connect(SERVER.DB_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect db successfully!");
  } catch (error) {
    console.log("Connect db failue!");
  }
};

const app = express();
connectDatabase();
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookies());
app.use(router);
app.set("views", "./views");
app.set("view engine", "pug");

//upload photo
const storage = multer.diskStorage({});
const storageImageBlog = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/image");
  },
  filename: function (req, file, cb) {
    const nameImage = file.fieldname + "-" + Date.now() + ".jpg";
    cb(null, nameImage);
  },
});
const uploadAvatar = multer({ storage: storage });
const uploadImageBlog = multer({ storage: storageImageBlog });

//render page
router.get("/", auththenticator, homePage);
router.get("/register", authController.renderRegister);
router.get("/login", authController.renderLogin);
router.get("/profile", auththenticator, profileController.profilePage);
router.get(
  "/profile/:user_id",
  auththenticator,
  profileController.profileByUser
);

//auth action
router.post("/login", authController.login);
router.post("/register", authController.register);

//blog action
router.post(
  "/blog",
  auththenticator,
  uploadImageBlog.single("imageBlog"),
  blogController.createBlog
);
router.post(
  "/blog/:id_blog",
  uploadImageBlog.single("imageBlogEdit"),
  auththenticator,
  blogController.editBlog
);
router.delete("/blog/:id_blog", auththenticator, blogController.deleteBlog);

//comment action
router.post("/comments", auththenticator, commentController.createComments);
router.put(
  "/comments/:id_comment",
  auththenticator,
  commentController.editComment
);
router.delete(
  "/comments/:id_comment",
  auththenticator,
  commentController.delComment
);

//react action
router.post("/react", auththenticator, reactController.handleReact);

//profile action
router.post(
  "/profile",
  auththenticator,
  uploadAvatar.single("avatar"),
  profileController.profile
);
router.post(
  "/reset-password",
  auththenticator,
  profileController.resetPassword
);

app.listen(SERVER.PORT, () => {
  console.log(`Server is running on port: ${SERVER.PORT}`);
});
