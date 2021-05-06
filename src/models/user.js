const { Schema, model } = require("mongoose");

const userschema = new Schema({
  firstName: { type: String, default: "", required: true },
  lastName: { type: String, default: "", required: true },
  email: { type: String, default: null },
  gender: { type: String, default: "", enum: ["", "Male", "Female", "Other"] }, // M,F,O
  password: { type: String, default: "", required: true },
  age: { type: Number, default: "" },
  role: { type: String, default: "User", enum: ["", "User", "Admin"] },
  profilePhoto: { type: String, default: "" },
  status: {
    type: String,
    default: "Inactive",
    enum: ["", "Active", "Inactive"],
  },
  // blogs: {
  //     type: Schema.Types.ObjectId,
  //     ref: "blog"
  //  }
});

module.exports = model("user", userschema);
