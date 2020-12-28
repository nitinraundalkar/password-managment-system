var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var dashboardRoute = require("./routes/dashboardRoute");
var addNewCategoryRoute = require("./routes/addNewCategoryRoute");
var viewAllCategoryRoute = require("./routes/viewAllCategoryRoute");
var addnewPasswordRoute = require("./routes/addNewPasswordRoute");
var viewAllPasswordRoute = require("./routes/viewAllPasswordRoute");
var passwordDetailsRoute = require("./routes/passowrdDetailsRoute");

// api
var addNewCategoryApi = require("./api/addNewCategoryApi");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/dashboard", dashboardRoute);
app.use("/add-new-category", addNewCategoryRoute);
app.use("/password-category", viewAllCategoryRoute);
app.use("/add-new-password", addnewPasswordRoute);
app.use("/view-all-password", viewAllPasswordRoute);
app.use("/password-detail", passwordDetailsRoute);

// api

app.use("/api", addNewCategoryApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
