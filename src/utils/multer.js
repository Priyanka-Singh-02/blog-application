var express = require("express");
const multer = require("multer");
var app = express();

app.use(express.static(__dirname + "/src/uploads "));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

module.exports = multer({ storage: storage });
