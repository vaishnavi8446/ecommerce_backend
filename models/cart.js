const mongoose = require("mongoose");
const { User } = require("./user");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    products: [
      {
        productId: Number,
        title: String,
        description: String,
        price: Number,
        category: String,
        subCategory: String,
        discount: Number,
        availability: String,
        quantity: Number
      },
    ],
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);