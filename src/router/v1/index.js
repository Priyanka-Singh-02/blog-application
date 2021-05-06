const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth");
const BlogRouter = require("./blog");
const AdminRouter = require("./admin");

router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);
router.use("/blog", BlogRouter);
module.exports = router;
