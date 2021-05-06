const { adminModel } = require("../models");
const bcrypt = require("bcryptjs");

const admin = async () => {
  // console.log("ksnkv")
  const result = await adminModel.find({ email: "admin@gmail.com" });
  console.log(result, "result");

  if (result.length === 0) {
    password = "neelam@1234";
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hashSync(password, salt);
    await adminModel.create({
      firstName: "Neelam",
      lastName: "Singh",
      email: "admin@gmail.com",
      password: hashedPassword,
      gender: "Female",
    });
    // console.log(result)
  }
};

module.exports = { admin };
