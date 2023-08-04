
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");



//connect to db
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
//init app
const app = express();
//set the template engine
app.set("view engine", "ejs");
//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));
//static folder
app.use(express.static(path.resolve(__dirname, "file")));

app.use(express.json());

const userRoutes = require("./routes/user");

const productRoute = require("./routes/product");
const product = require("./models/product");

app.use("/users", userRoutes);

app.use("/products", productRoute);

//route for Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//assign port
app.listen(3000, () => {
  console.log("Port running on 3000");
});
