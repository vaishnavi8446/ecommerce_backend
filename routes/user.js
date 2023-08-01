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
      isAdmin: req.body.isAdmin
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
        msg: "Internal Server Error!"
      });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = "test";

  if (!user) {
    return res.status(400).send("User not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userID: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Password is mismatch");
  }

  return res.status(200).send(user);
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments((count) => count);
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({
    userCount: userCount,
  });
});

module.exports = router;
