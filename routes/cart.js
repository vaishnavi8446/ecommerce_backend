const express = require("express");
const router = express.Router();
const Cart = require("./../models/cart");

/**
 * @swagger
 * components:
 *   schemas:
 *     cProduct:
 *       type: object
 *       required:
 *         - productId
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
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
 *            example:8gb
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
 *       example:
 *         productId:2
 *         title: Jeans
 *         description: Fashion
 *         price: 700
 *         category: women
 *         subCategory:
 *         discount: 300
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 * 
 * /carts/cart/{userId}:
 *   post:
 *     summary: Create a new cart!
 *     tags: [Carts]
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/cProduct'
 *     responses:
 *       200:
 *         description: The cart created successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/cProduct'
 *       500:
 *         description: Some server error
 * 
 */


router.post("/cart/:userId", async (req, res) => {
  const {
    productId,
    title,
    description,
    price,
    category,
    subCategory,
    discount,
  } = req.body;

  

  try {
    const userId = req.params.userId;
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

      // let pRes = newCart.products.push({
      //   productId,
      //   title,
      //   description,
      //   price,
      //   category,
      //   subCategory,
      //   discount,
      // });

      return res.status(200).send({
        msg: "Product added to Cart!",
        result: newCart,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
