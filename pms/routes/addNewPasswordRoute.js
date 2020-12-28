var express = require("express");
var router = express.Router();
var userModel = require("../modules/user");
var passCatNameModel = require("../modules/passwordCatNameModel");
var passDetailModel = require("../modules/addNewPasswordModel");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var passCatName = passCatNameModel.find({});
var passwordDetail = passDetailModel.find({});

function checkLoginToken(req, res, next) {
  var loginToken = localStorage.getItem("loginToken");
  try {
    var decoded = jwt.verify(loginToken, "secretekey");
  } catch (err) {
    res.redirect("/");
  }
  next();
}

// node local storage code
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

// Middleware to check email is exist or not
function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkEmailExist = userModel.findOne({ email: email });
  checkEmailExist.exec((err, data) => {
    if (err) throw err;
    if (data) {
      res.render("signup", {
        title: "Password Managment Syatem",
        massage: "Email Already Exist",
      });
    }
    next();
  });
}
// Middleware to check username exist or not
function checkUsername(req, res, next) {
  var username = req.body.uname;
  var checkUserExist = userModel.findOne({ username: username });
  checkUserExist.exec((err, data) => {
    if (err) throw err;
    if (data) {
      res.render("signup", {
        title: "Password Managment Syatem",
        massage: "Username Already Exist",
      });
    }
    next();
  });
}

router.get("/", checkLoginToken, function (req, res, next) {
  var userToken = localStorage.getItem("userToken");
  var passCat = passCatNameModel.find({});
  passCat.exec((err, data) => {
    if (err) err;
    res.render("addNewPassword", {
      title: "Password Managment Syatem",
      userToken: userToken,
      records: data,
      success: "",
    });
  });
});

router.post("/", checkLoginToken, function (req, res, next) {
  var userToken = localStorage.getItem("userToken");
  var CatName = req.body.passCategory;
  var projectName = req.body.projectName;
  var passDetails = req.body.passDetails;

  var passwordDetails = new passDetailModel({
    category_name: CatName,
    project_name: projectName,
    password_details: passDetails,
  });

  passwordDetails.save((err, data) => {
    passCatName.exec((err, data) => {
      if (err) err;
      res.render("addNewPassword", {
        title: "Password Managment Syatem",
        userToken: userToken,
        records: data,
        success: "Password Details Inserted Successfully",
      });
    });
  });
});

module.exports = router;
