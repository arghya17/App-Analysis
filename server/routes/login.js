var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var bcrytpt = require("bcryptjs");
var User = require("../models/user");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret = process.env.jwt_secret;

var UserLogin = async (req, res) => {
  var { username, password } = req.body;
  var user = await User.findOne({ username }).lean();
  console.log(user);
  if (!user) {
    res.status(400);
    return res.json({ status: "error", error: "Invalid Username/password" });
  }
  //password cannot be searched because bcrypt does not return the same hash everytime
  if (await bcrytpt.compare(password, user.password)) {
    var token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      jwt_secret
    );
    res.status(202);
    res.json({ status: "Ok", token: token }); //this token must be stored in the frontend
    //so that after login the backend can verify the data
    return res;
  }
  res.json({ status: "error", error: "Invalid Username/Password" });
  return res;
};

var changePassword = (req, res) => {
  var { token, newpassword } = req.body;
  try {
    var user = jwt.verify(token, jwt_secret);
    console.log(user);
    var id = user._id;

    if (!newpassword || typeof newpassword != "string") {
      res.status(400);
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (newpassword.length < 6) {
      res.status(400);
      return res.json({
        status: "error",
        error: "Password two small should be at least 7 characters",
      });
    }
    var hashedPassword = bcrytpt.hash(newpassword, 10);
    User.findOneAndUpdate(
      { _id: id },
      {
        $set: { password: hashedPassword },
      }
    ).catch((err) => {
      console.log(err);
      res.status(404);
      res.json({ status: "error", error: "Database error" });
    });
    res.status(202);
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ status: "error", error: "somebody messed around the token" });
  }
};
module.exports.UserLogin = UserLogin;
module.exports.changePassword = changePassword;
