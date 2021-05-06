const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const customMessage = require("../../constants");
const adminModel = require("../../models/admin");
const userModel = require("../../models/user");
// const commentModel = require("../../models/comment");
// const blogModel = require("../../models/blog");
const constants = require("../../constants");

const login = async (req, res) => {
  // const { email, password } = req.body
  console.log("hi i am inside hbs engine");
  res.render("index", function (err, html) {
    if (err) {
      console.log(err, "hbs error");
    } else {
      res.send(html);
    }
  });
};
const loginCheck = async (req, res) => {
  try {
    console.log("hi i am checking logging credentials");
    const { email, password } = req.body;
    // console.log(req.body)
    let admindata = await adminModel.find({});
    // console.log(admindata,"admin data")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      // console.log(admindata[0].email)
      // console.log(admindata[0].password)
      const match = await bcrypt.compare(password, admindata[0].password);
      // console.log(match,"match")
      // if(match)

      if (email === admindata[0].email && match) {
        res.redirect("http://localhost:8010/api/v1/admin/dashboard");
      } else {
        res.render("index", {
          incorrect: "either your email or password is incorrect",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("hi i am inside delete user");
    const id = req.params.id;

    await userModel.findByIdAndDelete({ _id: id }, function (err, del) {
      if (err) {
        res.status(400).json({
          error: customMessage.Messages.DELETE_ERROR,
        });
      } else {
        res.redirect("http://localhost:8010/api/v1/admin/dashboard");
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ delete_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const updateStatus = async (req, res) => {
  try {
    console.log("hi i am inside update user status");
    const id = req.params.id;
    console.log(id);

    let userdata = await userModel.findById({ _id: id });
    if (userdata) {
      if (userdata.status === constants.staticValues.STATUS_INACTIVE) {
        let myNewData = {
          status: constants.staticValues.STATUS_ACTIVE,
        };
        userModel.updateOne({ _id: id }, myNewData, function (err, change) {
          if (err) {
            res.status(400).json({
              error: customMessage.Messages.UPDATE_ERROR,
            });
          } else {
            
            res.redirect("http://localhost:8010/api/v1/admin/dashboard");
          }
        });
      } else if (userdata.status === constants.staticValues.STATUS_ACTIVE) {
        let myNewData = {
          status: constants.staticValues.STATUS_INACTIVE,
        };
        userModel.updateOne({ _id: id }, myNewData, function (err, change) {
          if (err) {
            res.status(400).json({
              error: customMessage.Messages.UPDATE_ERROR,
            });
          } else {
            res.redirect("http://localhost:8010/api/v1/admin/dashboard");
          }
        });
      } else {
        res.status(400).customMessage.Messages.UPDATE_ERROR;
      }
    } else {
      res.status(400).customMessage.Messages.USER_NOT_EXIST;
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const dashboard = async (req, res) => {
  try {
    let userdata = await userModel.find({});
    // // let blogdata = await blogModel.find({});
    // let commentdata = await commentModel.find({});

    // console.log(userdata)
    const user = await userModel.aggregate([
      {
        $lookup: {
          from: "blogs",
          as: "MyBlog",
          foreignField: "author",
          localField: "_id",
        },
      },
    ]);

    // // console.log(user,"this is console.log user");
    // // console.log(user[0].MyBlog[0].body,"this is my blog");

    // const comment = await blogModel.aggregate([
    //   //   {
    //   //   $lookup: {
    //   //     from: "blogs",
    //   //     as: "MyBlog",
    //   //     foreignField: "author",
    //   //     localField: "_id",
    //   //   },
    //   // },
    //   // { $unwind: "$MyBlog" }, // toggle this unwind to see all users data and current user data

    //   {
    //     $lookup: {
    //       from: "comments",
    //       as: "Comments",
    //       foreignField: "blogId",
    //       localField: "_id",
    //     },
    //   },
    //   // { $unwind: "$Comments" },
    // ]);
    const comment = await userModel.aggregate([
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
    ])

    // console.log(comment, "this is console.log comment");

    res.render("dashboard", {
      user: userdata,

      blogs: user,
      comments: comment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

module.exports = { login, loginCheck, deleteUser, updateStatus, dashboard };
