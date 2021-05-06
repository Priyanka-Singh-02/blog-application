const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  firstName: { type: String, default: "", required: true },
  lastName: { type: String, default: "", required: true },
  email: { type: String, default: null },
  gender: { type: String, default: "", enum: ["", "Male", "Female", "Other"] }, // M,F,O
  password: { type: String, default: null },
});

module.exports = model("admin", adminSchema);
