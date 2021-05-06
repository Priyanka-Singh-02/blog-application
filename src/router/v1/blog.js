const express = require("express");
const router = express.Router();

const { BlogController } = require("../../controller/v1");
const { CommentController } = require("../../controller/v1");
const { BlogValidator } = require("../../validators");
const AuthUser = require("../../utils/token");
const image = require("../../utils/multer");

router.post(
  "/addBlog",
  image.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 3 },
  ]),
  AuthUser,
  BlogValidator.validateAddBlog,
  BlogController.addBlog
);
router.get("/viewBlogs", AuthUser, BlogController.viewBlogs);
router.get("/viewMyBlogs", AuthUser, BlogController.viewMyBlogs);
router.delete("/deleteBlog/:id", AuthUser, BlogController.deleteBlog);
router.patch(
  "/updateBlog/:id",
  AuthUser,
  BlogValidator.blogUpdate,
  BlogController.updateBlog
);

router.get("/myBlogData/:id", AuthUser, BlogController.myBlogData);
router.post(
  "/addComment/:id",
  AuthUser,
  BlogValidator.commentValidate,
  CommentController.addComment
);
router.post("/likesDislikes/:id", AuthUser, CommentController.likeDislike);

router.get(
  "/commentsOnThisBlog/:id",
  AuthUser,
  CommentController.viewAllCommentsOnBlog
);

router.delete(
  "/deleteComment/:id",
  AuthUser,
  CommentController.deleteMyComment
);

router.patch(
  "/updateComment/:id",
  AuthUser,
  BlogValidator.commentValidate,
  CommentController.updateMyComment
);

module.exports = router;
