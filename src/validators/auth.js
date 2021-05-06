const { body } = require("express-validator");

const loginValidation = [
  body("email").not().isEmpty().trim().isEmail(),
  body("password").not().isEmpty().trim().isString().isLength({ max: 15 }),
];

const validateRegistration = [
  body("email")
    .not()
    .isEmpty()
    .trim()
    .isEmail()
    .withMessage("email must include '@' and '.' "),
  body("password")
    .isLength({ max: 15 })
    .not()
    .isEmpty()
    .withMessage("password max length is 6 characters"),

  body("gender")
    .not()
    .isEmpty()
    .isIn(["Male", "Female", "Other"])
    .withMessage("choose valid gender: 'Male','Female','Other'"),
  body("age").not().isEmpty().isNumeric().withMessage("Age should be a number"),
  body("firstName")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("first name should only contain alphabets"),
  body("lastName")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("last name should only contain alphabets"),
  body("role")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("role should only contain alphabets"),
];

const validateUpdation = [
  // body("email").isEmpty().withMessage("email cannot be changed"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("choose valid gender: 'Male','Female','Other'"),
  // body("role").isEmpty().withMessage("role cannot be changed"),
  body("password")
    .isEmpty()
    .withMessage("password cannot be changed from here!!!"),

  body("age").isNumeric().withMessage("Age should be a number"),
  body("firstName")
    .isAlpha()
    .withMessage("first name should only contain alphabets"),
  body("lastName")
    .isAlpha()
    .withMessage("last name should only contain alphabets"),
];

const validatePassword = [
  body("newpassword")
    .trim()

    // Validate minimum length of password
    // Optional for this context
    .isLength({ max: 15 })

    // Custom message
    .withMessage("Password must be max 15 characters")

    // Custom validation
    // Validate confirmPassword
    .custom(async (confirmpassword, { req }) => {
      const newpass = req.body.newpassword;
      const confirm = req.body.confirmpassword;
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if (newpass !== confirm) {
        throw new Error("newpassword and confirmpasswords must be same");
      }
    }),
];
module.exports = {
  validateRegistration,
  loginValidation,
  validateUpdation,
  validatePassword,
};
