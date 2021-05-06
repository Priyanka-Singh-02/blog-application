const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const customMessage = require("../../constants");
const userModel = require("../../models/user");
// const constants = require("../../constants");

const login = async (req, res) => {
  // const { email, password } = req.body
  console.log("hi i am inside hbs engine");
  res.render("userIndex", function (err, html) {
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
    console.log(typeof email);
    let userdata = await userModel.find({});

    //   console.log(userdata[0].firstName)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      for (let i = 0; i < userdata.length; i++) {
        const match = await bcrypt.compare(password, userdata[i].password);
        // console.log(match,"match")
        // if(match)

        //   console.log(userdata[i].email);
        if (email === userdata[i].email && match) {
          res.render("userDashboard");
          break;
        }
      }
      res.render("userIndex", {
        incorrect: "either your email or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

// const dashboard = async (req, res) => {
//     try {
//       let userdata = await userModel.find({});
//    res.render("dashboard", {
//         user: userdata,

//         blogs: user,
//         comments: comment,
//       });
//     } catch (error) {
//       console.log(error);
//       return res
//         .status(500)
//         .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
//     }
//   };

module.exports = { login, loginCheck };
