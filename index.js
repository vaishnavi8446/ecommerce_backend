var express = require("express");
var multer = require("multer");
const mongoose = require("mongoose");
var port = 5000;

var app = express();
const Product = require("./models/product");

let xlsxtojson = require("xlsx-to-json"),
  xlstojson = require("xls-to-json");

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/excelUploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public/excelUploads"));
app.use("/uploads", express.static("uploads"));


//2. to upload products in bulk using excel -seller

app.post("/uploadFile", upload.single("uploadfile"), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //importExcelData2MongoDB("./public" + "/excelUploads/" + req.file.filename);
  let excel2json;
  let response = "Files uploaded successfully!";

  res.send(response);
  if (!req.file) {
    res.json({ error_code: 404, err_desc: "File not found!" });
    return;
  }

  if (
    req.file.originalname.split(".")[
      req.file.originalname.split(".").length - 1
    ] === "xlsx"
  ) {
    excel2json = xlsxtojson;
  } else {
    excel2json = xlstojson;
  }
  excel2json(
    {
      input: `${req.file.path}`,
      output: "output/" + Date.now() + ".json", // output json
      lowerCaseHeaders: true,
    },
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        Product.insertMany(result, function (err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res);
          // return res.json({
          //   status: 200,
          //   msg: "Products uploaded successfully!",
          //   result: res,
          // });
        });
      }
    }
  );
});

app.listen(port, () => console.log(`Server running on port ${port}!`));
