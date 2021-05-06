// remove unwanted packages
const { validationResult } = require("express-validator");

const constants = require("../../constants");
const customMessage = require("../../constants");
const blogModel = require("../../models/blog");
const commentModel = require("../../models/comment");

const addComment = async (req, res) => {
  console.log("I am in add comment");
  try {
    // const userdata = await userModel.findById(req.user.id);
    // console.log(req.user.id, "comment author");
    // if (userdata) {
    let id = req.params.id;
    let user = req.user.id;
    console.log(user, "id");

    const blogdata = await blogModel.findOne({
      author: { $nin: req.user.id },
      _id: id,
    });
    console.log(blogdata);

    if (blogdata) {
      const { commentBody } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        var myComment = new commentModel({
          commentBody,
          commentAuthor: req.user.id,

          blogId: id,
          blogAuthor: blogdata.author,
          blogTitle: blogdata.title,
        });

        await commentModel.create(myComment, function (err, user) {
          if (err) {
            return res.status(500).json({
              comment_add_error: customMessage.Messages.COMMENT_ADD_ERROR,
            });
          } else {
            console.log(myComment);

            res
              .status(200)
              .json({ message: customMessage.Messages.COMMENT_ADD_SUCCESS });
          }
        });
      }
    } else {
      res.status(200).json({ message: customMessage.Messages.COMMENT_ERROR });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ blog_add_error: error });
  }
};

const likeDislike = async (req, res) => {
  try {
    console.log("I am inside like and dislikes");
    let id = req.params.id;
    let user = req.user.id;
    console.log(user, "id");

    const blogdata = await blogModel.findOne({
      author: { $nin: req.user.id },
      _id: id,
    });
    console.log(blogdata);

    if (blogdata) {
      const { like, dislike } = req.body;
      console.log(req.body);
      if (like) {
        if (like === constants.staticValues.TRUE) {
          // console.log(blogdata.likes)
          blogdata.likes++;
          console.log(blogdata.likes);
        } else if (like === constants.staticValues.FALSE) {
          if (blogdata.likes > 0) blogdata.likes--;
          else blogdata.likes = 0;
        }
      }
      if (dislike) {
        if (dislike === constants.staticValues.TRUE) {
          // console.log(blogdata.dislikes)
          blogdata.dislikes++;
          console.log(blogdata.dislikes);
        } else if (dislike === constants.staticValues.FALSE) {
          if (blogdata.dislikes > 0) blogdata.likes--;
          else blogdata.dislikes = 0;
        }
      }
      if (like && dislike) {
        res
          .status(400)
          .json({ message: customMessage.Messages.CANT_ADD_META_INFO });
      }
      let mydata = {
        likes: blogdata.likes,
        dislikes: blogdata.dislikes,
      };
      await blogModel.updateOne({ _id: id }, mydata, function (err, user) {
        if (err) {
          return res.status(500).json({ like_dislike_add_error: err });
        } else {
          // console.log(myComment);
          res
            .status(200)
            .json({ message: customMessage.Messages.META_INFO_SUCCESS });
        }
      });
    } else {
      res.status(200).json({ message: customMessage.Messages.META_INFO_ERROR });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ blog_add_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const viewAllCommentsOnBlog = async (req, res) => {
  try {
    console.log("I am in view all comments on a blog");
    const id = req.params.id;
    const blog = await blogModel.findById({ _id: id });
    if (blog) {
      const comments = await commentModel.find({ blogId: id });
      // console.log(comments);
      if (comments) {
        res.status(200).json({
          message: customMessage.Messages.VIEW_ALL_COMMENTS,
          id,
          comments,
        });
      } else
        res
          .status(400)
          .json({ message: customMessage.Messages.NO_COMMENTS_FOUND });
    } else {
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ blog_view_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const deleteMyComment = async (req, res) => {
  try {
    console.log("I am inside delete my comment");
    const id = req.params.id;
    const comment = await commentModel.findOne({
      commentAuthor: req.user.id,
      _id: id,
    });
    if (comment) {
      commentModel.deleteOne({ _id: id }, function (err, del) {
        if (err) {
          res.status(400).json({
            error: customMessage.Messages.DELETE_ERROR,
          });
        }
        res.status(200).json({
          message: customMessage.Messages.DELETE_SUCCESS,
        });
      });
    } else {
      res
        .status(400)
        .json({ comment_view_error: customMessage.Messages.COMMENT_NOT_EXIST });
    }
  } catch {
    res
      .status(500)
      .json({ blog_view_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const updateMyComment = async (req, res) => {
  try {
    console.log("I am inside update my comment");
    const id = req.params.id;
    const comment = await commentModel.findOne({
      commentAuthor: req.user.id,
      _id: id,
    });
    if (comment) {
      const { commentBody } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        let myNewData = {
          commentBody: commentBody || comment.commentBody,
        };

        commentModel.updateOne({ _id: id }, myNewData, function (err, del) {
          if (err) {
            res.status(400).json({
              error: customMessage.Messages.UPDATE_ERROR,
            });
          }
          res.status(200).json({
            message: customMessage.Messages.UPDATE_SUCCESS,
          });
        });
      }
    } else {
      res
        .status(400)
        .json({ comment_view_error: customMessage.Messages.COMMENT_NOT_EXIST });
    }
  } catch {
    res
      .status(500)
      .json({ blog_view_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

module.exports = {
  addComment,
  likeDislike,
  viewAllCommentsOnBlog,
  deleteMyComment,
  updateMyComment,
};
