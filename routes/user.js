const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");


//swagger fo register api
/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - isAdmin
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: Name of user
 *         email:
 *           type: string
 *           description: email
 *         password:
 *            type: string
 *         isAdmin:
 *           type: boolean
 *           description: isAdmin
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date in which user was added
 *       example:
 *         name: Vaishnavi Ambolkar
 *         email: Vaishnavi123@gmail.com
 *         password: Vaishu@022
 *         isAdmin: false
 */


//swagger for login api
/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         email:
 *           type: string
 *           description: email
 *         password:
 *            type: string
 *       example:
 *         email: Vaishnavi123@gmail.com
 *         password: Vaishu@022
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
 * /users/register:
 *   post:
 *     summary: Register a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 * /users/login:
 *   post:
 *     summary: Login User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login Successful!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 *
 */


//1.To register on the platform - using email and password  -seller & buyer

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




// 2.login through the platform using email and password -buyer & seller

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
        status: 200,
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
