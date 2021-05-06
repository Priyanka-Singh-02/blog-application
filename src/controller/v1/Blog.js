const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require("express-validator");

const customMessage = require("../../constants");
const blogModel = require("../../models/blog");
const userModel = require("../../models/user");

const addBlog = async (req, res) => {
  console.log("I am in add blog");
  try {
    let poster = req.files.poster.map((file) => file.path);
    // console.log(poster)
    let thumb = req.files.thumbnail.map((file) => file.path);
    // console.log(thumb)
    const { title, createdAt, category, body } = req.body;

    var myBlogData = new blogModel({
      title,
      author: req.user.id,
      body,
      createdAt,
      category,
      mainImage: JSON.stringify(poster),
      thumbnail: JSON.stringify(thumb),
    });

    await blogModel.create(myBlogData, function (err, user) {
      if (err) {
        return res
          .status(400)
          .json({ blog_add_error: customMessage.Messages.BLOG_ADD_ERROR });
      } else {
        console.log(myBlogData);
        res
          .status(200)
          .json({ message: customMessage.Messages.BLOG_ADD_SUCCESS });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ blog_add_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const viewBlogs = async (req, res) => {
  try {
    console.log("I am in view all blogs");

    const blogdata = await blogModel.find({});
    console.log(blogdata);
    if (blogdata) {
      res
        .status(200)
        .json({ message: customMessage.Messages.VIEW_ALL_BLOGS, blogdata });
    } else
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ blog_view_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const viewMyBlogs = async (req, res) => {
  try {
    console.log("I am inside view my blogs");

    const blogdata = await blogModel.find({ author: req.user.id });
    console.log(blogdata);
    if (blogdata) {
      res
        .status(200)
        .json({ message: customMessage.Messages.VIEW_YOUR_BLOGS, blogdata });
    } else
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ blog_view_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const updateBlog = async (req, res) => {
  try {
    console.log("I am inside update my blogs");

    let id = req.params.id;
    // console.log(id,"id")
    const blogdata = await blogModel.findById({ _id: id });
    // console.log(blogdata)
    if (blogdata) {
      if (blogdata.author == req.user.id) {
        const { title, body } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        } else {
          var myNewData = {
            title: title || blogdata.title,
            body: body || blogdata.body,
            // profilePhoto:profileImage[0].path //|| userdata.profilePhoto == Not working ==
          };
          console.log(myNewData);

          blogModel.updateOne({ _id: id }, myNewData, function (err, change) {
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
          .json({ message: customMessage.Messages.CANT_UPDATE_BLOG });
      }
    } else
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const deleteBlog = async (req, res) => {
  try {
    console.log("I am inside delete my blogs");

    let id = req.params.id;
    // console.log(id,"id")
    const blogdata = await blogModel.findById({ _id: id, author: req.user.id });
    // console.log(blogdata)
    if (blogdata) {
      // if (blogdata.author == req.user.id) {
      blogModel.deleteOne({ _id: id }, function (err, del) {
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
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
    }
    // } else {
    //   res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
    // }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ delete_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const myBlogData = async (req, res) => {
  try {
    console.log("I am inside veiwing my profile, blogs and comments");
    const id = req.params.id;
    // if (userdata) {
    const blogdata = await blogModel.findOne({ _id: ObjectId(id) });
    // console.log(blogdata);
    if (blogdata) {
      const user = await userModel.aggregate([
        {
          $lookup: {
            from: "blogs",
            as: "MyBlog",
            foreignField: "author",
            localField: "_id",
          },
        },
        { $unwind: "$MyBlog" }, // toggle this unwind to see all users data and current user data

        {
          $lookup: {
            from: "comments",
            as: "MyBlog.Comments",
            foreignField: "blogId",
            localField: "MyBlog._id",
          },
        },
        // { $unwind: "$MyBlog.Comments" },

        //  {
        //           $match: {
        //             $and: [
        //               // { "MyBlog._id": ObjectId(id) },
        //               // {"MyBlog.Comments.blogId":ObjectId(id)},
        //               // { _id: ObjectId(req.user.id) },

        //             ],
        //           },
        //         },

        {
          $project: {
            firstName: 1,
            lastName: 1,
            _id: 1,
            "MyBlog._id": 1,
            "MyBlog.title": 1,
            "MyBlog.body": 1,
            "MyBlog.author": 1,
            // "Comments": 1,
            "MyBlog.Comments.blogId": 1,
            "MyBlog.Comments.commentBody": 1,
            "MyBlog.Comments.commentAuthor": 1,
          },
        },
      ]);

      res.status(200).json(user);
    } else {
      res.status(400).json({ message: customMessage.Messages.BLOG_NOT_FOUND });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

module.exports = {
  addBlog,
  viewBlogs,
  viewMyBlogs,
  updateBlog,
  deleteBlog,
  myBlogData,
};
