const express = require("express");
const router = express.Router();

const { AdminController } = require("../../controller/v1");
const { AuthValidator } = require("../../validators");

router.get("/login", AdminController.login);
router.post(
  "/dashboard",
  AuthValidator.loginValidation,
  AdminController.loginCheck
);


router.get("/delete/:id", AdminController.deleteUser);
router.get("/update/:id", AdminController.updateStatus);
router.get("/dashboard", AdminController.dashboard);
module.exports = router;
