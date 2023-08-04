const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");

const fs = require("fs");

const Product = require("../models/product");

const filePath = "C:/Users/Dell/Desktop/ecommerce_backend/file/test.xlsx";

//3. to see all my uploaded products -seller
router.get("/getAllProducts", async (req, res) => {
  function convertExcelFileToJsonUsingXlsx() {
    // File Reading
    const file = xlsx.readFile(filePath);

    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;

    let parsedData = [];

    for (let i = 0; i < totalSheets; i++) {
      // Convert xlsx to json
      const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);

      // Skip header row which is the colum names
      // tempData.shift();

      // Add json to our result array
      parsedData.push(...tempData);
    }

    // call a function to save the data in a json file

    generateJSONFile(parsedData);
  }

  convertExcelFileToJsonUsingXlsx();

  function generateJSONFile(data) {
    try {
      fs.writeFileSync("data.json", JSON.stringify(data));
      res.send({
        status: 200,
        msg: "Products list successfully listed!",
        result: data,
        count: data.length,
      });
    } catch (err) {
      console.error(err);
      res.send({
        status: 500,
        msg: "Internal Server Error!",
      });
    }
  }
});


//5.  to mark a product as *Out of Stock* and *Available* 

router.put("/updateProductStatus/:id", async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }

    const id = req.params.id;

    await Product.findByIdAndUpdate(id, {
      availability: req.body.availability,
    })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Product not found.`,
          });
        } else {
          res.send({
            message: "Product updated successfully!",
            result: data,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  } catch (err) {
    console.error(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

//3. to see all my uploaded products -seller
router.get("/getProductsList", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const productsList = await Product.find();
    if (!productCount && productsList) {
      return res.status(500).send({
        status: 500,
        msg: "Something went wrong!",
      });
    }
    res.status(200).send({
      msg: "Count fetched successfully!",
      productCount: productCount,
      result: productsList,
    });
  } catch (err) {
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

//2.To see all the *Available* products on the platform -buyer

router.get("/getBuyerProductsList", async (req, res) => {
  try {
    const productsList = await Product.find({ availability: "Available" });
    const productsListCount = await Product.find({
      availability: "Available",
    }).count();

    if (!productsList) {
      return res.status(500).send({
        status: 500,
        msg: "Something went wrong!",
      });
    }
    res.status(200).send({
      msg: "Buyer product list fetched successfully!",
      count: productsListCount,
      result: productsList,
    });
  } catch (err) {
    console.error(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

module.exports = router;
