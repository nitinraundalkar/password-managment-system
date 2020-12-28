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

/* GET home page. */
router.get("/", function (req, res, next) {
  var loginToken = localStorage.getItem("loginToken");
  if (loginToken) {
    res.redirect("/dashboard");
  } else {
    res.render("index", { title: "Password Managment Syatem", massage: "" });
  }
});

router.post("/", function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModel.findOne({ username: username });
  checkUser.exec((err, data) => {
    if (err) throw err;
    var userId = data._id;
    var getPassword = data.password;
    if (bcrypt.compareSync(password, getPassword)) {
      var token = jwt.sign({ loginToken: userId }, "secretekey");
      localStorage.setItem("loginToken", token);
      localStorage.setItem("userToken", username);
      res.redirect("/dashboard");
    } else {
      res.render("index", {
        title: "Password Managment Syatem",
        massage: "Invalid Username or Password",
      });
    }
  });
});

router.get("/signup", function (req, res, next) {
  var loginToken = localStorage.getItem("loginToken");
  if (loginToken) {
    res.redirect("/dashboard");
  } else {
    res.render("signup", { title: "Password Managment Syatem", massage: "" });
  }
});

router.post("/signup", checkUsername, checkEmail, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;

  if (password != confpassword) {
    res.render("signup", {
      title: "Password Managment Syatem",
      massage: "Password Not Matched!",
    });
  } else {
    password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModel({
      username: username,
      email: email,
      password: password,
    });
    userDetails.save((err, data) => {
      if (err) throw err;
      res.render("signup", {
        title: "Password Managment Syatem",
        massage: "User Registered Successfully",
      });
    });
  }
});

router.get("/logout", function (req, res, next) {
  localStorage.removeItem("loginToken");
  localStorage.removeItem("userToken");

  res.redirect("/");
});
module.exports = router;
