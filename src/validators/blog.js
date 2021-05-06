const { body } = require("express-validator");

const validateAddBlog = [
  body("title")
    .not()
    .isEmpty()
    .isAlphanumeric()
    .withMessage("title should be alphanumeric"),
  body("body")
    .not()
    .isEmpty()
    .isAlphanumeric()
    .withMessage("title should be alphanumeric"),
  body("createdAt").isDate().withMessage("createdAt must only contain date"),
  body("category")
    .isAlpha()
    .withMessage("category should only contain alphabtes"),
];

const blogUpdate = [
  // body("createdAt")
  //   .isEmpty()
  //   .isDate()
  //   .withMessage("This field cannot be changed"),
  // body("category")
  //   .isEmpty()
  //   .isString()
  //   .withMessage("This field cannot be changed"),
  // body("likes")
  //   .isEmpty()
  //   .isNumeric()
  //   .withMessage("This field cannot be changed"),
  // body("dislikes")
  //   .isEmpty()
  //   .isNumeric()
  //   .withMessage("This field cannot be changed"),
  body("title").isAlphanumeric().withMessage("title should be alphanumeric"),
  body("body").isAlphanumeric().withMessage("title should be alphanumeric"),
];

const commentValidate = [
  body("commentBody")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Comment should only be a string"),
];
module.exports = { blogUpdate, validateAddBlog, commentValidate };
