const messages = {
  //Messages for user schema
  LOGIN_SUCCESS: "you are logged in successfully",
  UNAUTHORIZED_REGISTRATION: "you are unauthorized to register as admin",
  UNAUTHORIZED_LOGIN: "you are unauthorized to login here",
  REGISTRATION_FAIL: "registration is failed",
  LOGIN_FAIL: "failed login!!",
  UNEXPECTED_ERROR: "unexpected error occured!",
  INCORRECT_PASSWORD: "password incorrect",
  USER_NOT_EXIST: "user does not exist",
  DELETE_SUCCESS: "data is deleted successfully",
  PASSWORD_CHANGE_SUCCESS: "password is changed successfully",
  PLEASE_LOGIN: "please login to view your profile",
  AUTH_FAIL: "Authentication is failed",
  DETAILS_NOT_FOUND: "Can't find user details!",
  INVALID_TOKEN: "Token is invalid!",
  ALREADY_EXIST: "user already exist. Please try loggin in!",
  REGISTRATION_SUCCESS: "Registration successfull !",
  DELETE_ERROR: "Unable to delete user!",
  CANT_CHANGE_EMAIL: "Email cannot be changed!",
  UNMATCHED_PASSWORD:
    "new password and confirm password should be same, please try again!",
  UPDATE_ERROR: "Unable to update user data",
  UPDATE_SUCCESS: "User details are updated successfully!",
  PLEASE_LOGIN: "please login",
  CONTACT_ADMIN: "please contact admin to activate your id",
  FIELDS_CANT_CHANGE: "this field cannot be changed",
  PLEASE_LOGIN: "please login to move ahead",

  //Messages for blog schema
  BLOG_ADD_SUCCESS: "your blog is addedd successfully!",
  BLOG_ADD_ERROR: "error in adding blog !",
  VIEW_ALL_BLOGS: "you are currently viewing all blogs",
  VIEW_YOUR_BLOGS: "you are currently viewing your blogs",
  BLOG_NOT_FOUND: "blog not found",
  CANT_UPDATE_BLOG: "you cannot update someone else's blog",
  CANT_DELETE_BLOG: "you are not authorized to delete this blog",

  //Messages for comment schema
  COMMENT_ADD_SUCCESS: "comment is addedd successfully!",
  COMMENT_ERROR: "you cannot comment on your own blog",
  COMMENT_ADD_ERROR: "error in adding comment",
  VIEW_ALL_COMMENTS: "you are currently viewing all comments on this blog id",
  NO_COMMENTS_FOUND: "there are no comments to view",
  COMMENT_NOT_EXIST:"there is no comment with this id",

  //constants for static data
  ROLE_USER: "User",
  STATUS_ACTIVE: "Active",
  STATUS_INACTIVE: "Inactive",
  INVALID_ROLE: "Invalid role value",
  ROLE_ADMIN: "Admin",
  TRUE: "true",
  FALSE: "false",

  //constants for likes-disikes
  META_INFO_ERROR: "you cannot like or dislike your own blog",
  META_INFO_SUCCESS: "Like or Dislike added successfully",
  CANT_ADD_META_INFO: "you cannot like and dislike at the same time",
};

module.exports = messages;
