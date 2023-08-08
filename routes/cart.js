const express = require("express");
const router = express.Router();
const Cart = require("./../models/cart");

router.post("/Cart", async (req, res) => {
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
