const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      zip: req.body.zip,
      isAdmin: req.body.isAdmin,
    });

    user = await user.save();

    if (!user) {
      return res.status(404).send("User cannot be created");
    } else {
      res.send({
        status: 200,
        msg: "Successfully registered!",
        result: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

router.post("/login", async (req, res) => {

  try {
    
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      res.status(401).send({
        status: 401,
        msg: "Login not successful",
        error: "User not found",
      });
    } else {
      res.status(200).send({
        status:200,
        msg: "Login successful!",
      
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

module.exports = router;
