const express = require("express");
const router = express.Router();

const AuthUser = require("../../utils/token");
const { AuthController } = require("../../controller/v1");
const { AuthViewController } = require ("../../controller/v1")
const { AuthValidator } = require("../../validators");
const image = require("../../utils/multer");

router.post(
  "/registration",
  image.array("profile", 1),
  AuthValidator.validateRegistration,
  AuthController.registration
);
router.post("/login", AuthValidator.loginValidation, AuthController.login);
router.get("/profile", AuthUser, AuthController.profile);
router.delete("/deleteUser", AuthUser, AuthController.deletion);
router.patch(
  "/updateUser",
  AuthUser,
  image.array("profile", 1),
  AuthValidator.validateUpdation,
  AuthController.updateProfile
);
router.patch(
  "/updatePassword",
  AuthUser,
  AuthValidator.validatePassword,
  AuthController.updatePassword
);
router.patch(
  "/deleteProfileImage",
  AuthUser,
  AuthController.deleteProfileImage
);
//AuthViewController

router.get("/login", AuthViewController.login);
router.post(
  "/dashboard",
  AuthValidator.loginValidation,
  AuthViewController.loginCheck
);

// router.get("/dashboard", AuthViewController.dashboard);
// router.get("/profileAndBlogs",AuthUser.authenticate, AuthController.profileAndBlogData);
module.exports = router;
