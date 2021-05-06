const express = require("express");
const router = express.Router();

const Routes = require("./v1");
router.use("/v1", Routes);

module.exports = router;
