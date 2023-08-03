const Product = require("./models/product");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const excelToJson = require("convert-excel-to-json");
const bodyParser = require("body-parser");


const fs = require("fs");

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
module.exports = upload;
const productRoute = require("./routes/product");
const product = require("./models/product");

app.use("/users", userRoutes);

app.use("/products", productRoute);

//route for Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/file/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
  });
  var upload = multer({ storage: storage });
// Upload excel file and import to mongodb
app.post("/uploadfile", upload.single("uploadfile"), (req, res) => {
  importExcelData2MongoDB(__dirname  + "/file/" + req.file.filename);
  console.log(res);
});

//Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath) {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: "Tests",

        // Mapping columns to keys
        columnToKey: {
          A: "title",
          B: "description",
          C: "price",
          D: "category",
          E: "subcategory",
          F: "discount",
        },
      },
    ],
  });
  // -> Log Excel Data to Console
  console.log(excelData);

  // Insert Json-Object to MongoDB
  Product.insertMany(excelData.test, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  fs.unlinkSync(filePath);
}

//assign port
app.listen(3000, () => {
  console.log("Port running on 3000");
});
