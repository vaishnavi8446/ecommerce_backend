var express = require("express");

const mongoose = require("mongoose");
var port = 5000;

var app = express();
const Product = require("./models/product");

mongoose.connect(
  "mongodb://localhost:27017/ecommerce",
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("Connected");
    } else {
      console.log("Error");
    }
  }
);



app.use(express.static(__dirname + "/public/excelUploads"));
app.use("/uploads", express.static("uploads"));



app.listen(port, () => console.log(`Server running on port ${port}!`));
