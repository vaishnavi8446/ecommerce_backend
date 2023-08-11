
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");
const port = 8000;

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

const cartRoute = require("./routes/cart");

app.use("/users", userRoutes);

app.use("/products", productRoute);

app.use("/carts", cartRoute);

//route for Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Ecommerce Website",
      version: "0.1.0",
      description:
        "This is Ecommerce Website Backend made with Express and documented with Swagger",
      contact: {
        name: "Vaishnavi Ambolkar",
        url: "https://github.com/vaishnavi8446",
        email: "vaishnaviambolkar8446@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

//To add search bar in swagger ui & customize Swagger UI 
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);

//assign port
app.listen(port, () => console.log(`Listening on port ${port}!`));


module.exports = app;