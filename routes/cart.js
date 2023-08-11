const express = require("express");
const router = express.Router();
const Cart = require("./../models/cart");

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - productId
 *         - title
 *         - description
 *       properties:
 *         productId:
 *           type: number
 *           description: Product id of the cart
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the product
 *           example: Oppo
 *         description:
 *            type: string
 *            description: Description of the product
 *            example:Phone-8gb
 *         price:
 *           type: number
 *           description: price of the product
 *           example: 25000
 *         category:
 *            type: string
 *            description: category of the product
 *            example: Electronics
 *         subCategory:
 *            type: string
 *            description: sub-category of the product
 *            example: android
 *         discount:
 *           type: number
 *           description: discount of the product
 *           example: 5000
 *         modifiedOn:
 *           type: string
 *           format: date
 *           description: The date in which cart was added
  */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API
 * /carts/cart:
 *   post:
 *     summary: Create a new cart
 *     tags: [carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: The created cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 *
 */

router.post("/cart", async (req, res) => {
  const {
    productId,
    title,
    description,
    price,
    category,
    subCategory,
    discount,
  } = req.body;

  const userId = "64d20b9a9a6779f427a2d311"; //log in user id --take userId from logged in user
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const newCart = await Cart.create({
        userId,
        products: [
          {
            productId,
            title,
            description,
            price,
            category,
            subCategory,
            discount,
          },
        ],
      });

      let pRes = newCart.products.push({
        productId,
        title,
        description,
        price,
        category,
        subCategory,
        discount,
      });

      return res.status(200).send({
        msg: "Product added to Cart!",
        count: pRes,
        result: newCart,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error!");
  }
});



module.exports = router;
