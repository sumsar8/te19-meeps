require('dotenv').config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload")
var logger = require("morgan");
const nunjucks = require("nunjucks");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var meepsRouter = require("./routes/meeps");
var loginRouter = require("./routes/login");
var profileRouter = require("./routes/profile");
var registerRouter = require("./routes/register");
var session = require('express-session')
var app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});
// view engine setup

app.use(session({
  secret: 'dogmawater',
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}));
app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/meeps", meepsRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/profile", profileRouter);


module.exports = app;
