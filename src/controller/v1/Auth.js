const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const customMessage = require("../../constants");
const constants = require("../../constants");
const userModel = require("../../models/user");

let check = false;
const registration = async (req, res) => {
  console.log("I am in registration");
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      gender,
      age,
      role,
    } = req.body;
    console.log(req.body);

    if (role === constants.staticValues.ROLE_USER) {
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = bcrypt.hashSync(password, salt);
      const errors = validationResult(req);

      const userdata = await userModel.findOne({ email });

      if (!userdata) {
        let profileImage = req.files;
        console.log(profileImage);
        var mydata = new userModel({
          firstName,
          lastName,
          password: hashedPassword,
          email,
          gender,
          age,
          role,
          profilePhoto: profileImage[0].path,
        });
      } else {
        res.status(400).json({ message: customMessage.Messages.ALREADY_EXIST });
      }

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        await userModel.create(mydata, function (err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log(mydata);
            res
              .status(200)
              .json({ message: customMessage.Messages.REGISTRATION_SUCCESS });
          }
        });
      }
    } else if (role === constants.staticValues.ROLE_ADMIN) {
      res
        .status(400)
        .json({ message: customMessage.Messages.UNAUTHORIZED_REGISTRATION });
    } else {
      // console.log(role)
      res.status(400).json({ message: customMessage.Messages.INVALID_ROLE });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ registration_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const login = async (req, res) => {
  console.log("I am inside login");
  const { email, password } = req.body;
  console.log(req.body);
  //console.log(blog.length)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    try {
      let userdata = await userModel.findOne({ email: email });
      console.log(userdata);
      if (!userdata)
        return res
          .status(400)
          .json({ error: customMessage.Messages.USER_NOT_EXIST });

      if (
        userdata.role === constants.staticValues.ROLE_USER &&
        userdata.status === constants.staticValues.STATUS_ACTIVE
      ) {
        const match = await bcrypt.compare(password, userdata.password);
        console.log(match, "password matched", userdata.status, "status");

        if (!match)
          return res
            .status(400)
            .json({ message: customMessage.Messages.INCORRECT_PASSWORD });
        // else if(match){

        const payload = {
          user: {
            id: userdata.id,
            role: userdata.role,
          },
        };

        token = jwt.sign(payload, "config.secret", {
          expiresIn: 86400, // expires in 24 hours
        });
        //console.log(token);

        res.status(200).json({
          success: customMessage.Messages.LOGIN_SUCCESS,
          token: token,
        });
        check = true;
        console.log(check);
      } else {
        res
          .status(400)
          .json({ login_status: customMessage.Messages.CONTACT_ADMIN });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ login_error: customMessage.Messages.UNEXPECTED_ERROR });
    }
  }
};

const profile = async (req, res) => {
  try {
    console.log("I am in profile");
    const userdata = await userModel.findById(req.user.id);
    if (check) {
      if (userdata) {
        res.status(200).json(userdata);
      } else {
        res
          .status(400)
          .json({ message: customMessage.Messages.DETAILS_NOT_FOUND });
      }
    } else {
      res.status(400).json({ message: customMessage.Messages.PLEASE_LOGIN });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ profile_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const deletion = async (req, res) => {
  try {
    // const userdata = await userModel.findById(req.user.id);
    // console.log(userdata);
    // if (userdata) {
    console.log("I am inside delete user");
    userModel.findByIdAndDelete({ _id: req.user.id }, function (err, del) {
      if (err) {
        res.status(400).json({
          error: customMessage.Messages.DELETE_ERROR,
        });
      }
      res.status(200).json({
        message: customMessage.Messages.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ delete_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("I am inside updating my profile");
    const userdata = await userModel.findById(req.user.id);
    // if (userdata) {
    // const { email } = req.params.email;
    const { gender, age, firstName, lastName } = req.body;
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let profileImage = req.files;
    console.log(profileImage);
    // if(profileImage === [])
    // {//|| userdata.profilePhoto == Not working ==
    //   res.status(400).json({message:"please upload an image"})
    // }
    var myNewData = {
      firstName: firstName || userdata.firstName,
      lastName: lastName || userdata.lastName,
      // password:hashedPassword,
      // email,
      gender: gender || userdata.gender,
      age: age || userdata.age,
      // role,
      profilePhoto: profileImage[0].path,
    };
    console.log(myNewData);

    userModel.updateOne(
      { _id: req.user.id },
      myNewData,
      function (err, change) {
        if (err) {
          res.status(400).json({
            error: customMessage.Messages.UPDATE_ERROR,
          });
        }
        res.status(200).json({
          message: customMessage.Messages.UPDATE_SUCCESS,
        });
      }
    );
    // }
    // else {
    //   res.status(500).json({ message: customMessage.Messages.USER_NOT_EXIST });
    // }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("I am inside updating my password");
    // const userdata = await userModel.findById(req.user.id);

    // if (userdata) {
    // const { email } = req.params.email;
    const { newpassword, confirmpassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);

    let hashedPassword = bcrypt.hashSync(newpassword, salt);

    var myNewData = {
      password: hashedPassword,
    };
    // console.log(myNewData,"mynewdata")

    userModel.updateOne(
      { _id: req.user.id },
      myNewData,
      function (err, change) {
        if (err) {
          res.status(400).json({
            error: customMessage.Messages.UPDATE_ERROR,
          });
        }
        res.status(200).json({
          message: customMessage.Messages.UPDATE_SUCCESS,
        });
      }
    );
    // }
    // else {
    //   res.status(500).json({ message: customMessage.Messages.USER_NOT_EXIST });
    // }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    // const userdata = await userModel.findById(req.user.id);
    console.log("I am inside deleting my profile image");
    // if (userdata) {
    var myNewData = {
      profilePhoto: null,
    };
    userModel.findByIdAndUpdate(
      { _id: req.user.id },
      myNewData,
      function (err, change) {
        if (err) {
          res.status(400).json({
            error: customMessage.Messages.UPDATE_ERROR,
          });
        }
        res.status(200).json({
          message: customMessage.Messages.UPDATE_SUCCESS,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ delete_error: customMessage.Messages.UNEXPECTED_ERROR });
  }
};

module.exports = {
  registration,
  login,
  profile,
  deletion,
  updateProfile,
  updatePassword,
  deleteProfileImage,
};
