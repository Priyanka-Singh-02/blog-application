// const admin = require('./models/admin');

var express = require("express");
var multer = require("multer");
var http = require("http");
var cors = require("cors");
var path = require("path");
var bodyParser = require("body-parser");
var { connect } = require("mongoose");
var dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

// const adminModel = require("./models")
// const AdminController = require('./controller/v1/Admin');
const seeder = require("./seeders");
const router = require("./router");
// const { Router } = require("express");
// const { route } = require("./router");

dotenv.config();

var app = express();

connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database connected successfully.");
    console.log(seeder, "seeders");
    seeder.Seeders.admin();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log("Error in database connection", err.message);
  });

// import router from './routes';
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json({ limit: "100mb" }));
app.set("views", path.join(__dirname, "/views"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: __dirname + "/views",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      // Function to do basic mathematical operation in handlebar
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
    },
  })
);
app.set("view engine", "hbs");
// var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token", "authorization"],
};
app.use(cors(corsOption));

// Image Path

app.use("/api", router);
app.use(express.static(path.join(__dirname, "..", "public")));

// Image Path
app.use("/assets", express.static(path.join(__dirname, "..", "app", "assets")));

// app.use('/AdminController', router);
// app.use('/', usersRouter);
/* create server */
const server = http.createServer(app);

/* add socket server */
// socketInitialize(server);

const port = process.env.PORT || 8010;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
  // document.write("hello world")
  // res.end(`<html><body><h1>This is HTML</h1></body></html>`);
});

// module.exports = app;
