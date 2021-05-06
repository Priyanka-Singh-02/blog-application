const jwt = require("jsonwebtoken");

const constants = require("../constants");
const customMessage = require("../constants");
const userModel = require("../models/user");

module.exports = async (req, res, next) => {
  // const token = req.header("token");
  // console.log(token);
  // if (!token)
  //   return res.status(401).json({ message: customMessage.Messages.AUTH_FAIL });

  try {
    const token = req.header("token");
    console.log(token, "token");
    if (!token)
      return res
        .status(401)
        .json({ message: customMessage.Messages.AUTH_FAIL });
    const decoded = jwt.verify(token, "config.secret");
    req.user = decoded.user;
    console.log(req.user, "decoded values from token");
    // next();log\\
    // console.log(req.user.id);
    // console.log(decoded);
    const checkUser = await userModel.findOne({
      _id: req.user.id,
      status: constants.staticValues.STATUS_ACTIVE,
    });
    console.log("going inside check user");
    // console.log(checkUser)
    if (checkUser) {
      console.log("user authenticated successfully");
      next();
    } else {
      res.status(400).json({ message: customMessage.Messages.USER_NOT_EXIST });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: customMessage.Messages.INVALID_TOKEN });
  }
};
