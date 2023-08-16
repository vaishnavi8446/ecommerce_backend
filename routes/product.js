const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");

const fs = require("fs");
var multer = require("multer");

const Product = require("../models/product");
let xlsxtojson = require("xlsx-to-json"),
  xlstojson = require("xls-to-json");

const filePath = "C:/Users/Dell/Desktop/ecommerce_backend/file/test.xlsx";
//
/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - password
 *         - isAdmin
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: title
 *         description:
 *           type: string
 *           description: description
 *         category:
 *            type: string
 *         isAdmin:
 *           type: boolean
 *           description: isAdmin
 *         quantity:
 *           type: string
 *           description: quantity
 *         createdBy:
 *           type: string
 * 
 *       example:
 *         id: 64d4e6b33a3c17c1425cb907
 *         name: Vaishnavi Ambolkar
 *         email: Vaishnavi123@gmail.com
 *         password: Vaishu@022
 *         isAdmin: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */


//swagger schema for updateProductStatus API

//swagger for updateStatus api
/**
 * @swagger
 * components:
 *   schemas:
 *     uProduct:
 *       type: object
 *       required:
 *         - availability
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         availability:
 *           type: string
 *           description: availability
 *       example:
 *         availability: Out of service
 */


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 * 
 * /products/updateProductStatus/{id}:
 *   put:
 *     summary: updateProductStatus
 *     tags: [Products]
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/uProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/uProduct'
 *       500:
 *         description: Some server error
 * 
 * 
 * /products/getProductsList:
 *   get:
 *     summary: getProductsList
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Fetched products list successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *
 * /products/getAvailableBuyerProductsList:
 *   get:
 *     summary: getAvailableBuyerProductsList
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Fetched available products list successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *
 * /products/stockList:
 *   get:
 *     summary: stockList
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Fetched left stock list successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 *
 * /products/filterProducts?category=electronics:
 *    get:
 *     summary: filterProducts
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Filter products displayed successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

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

//3. to see all my uploaded products -seller & -buyer
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

router.get("/getAvailableBuyerProductsList", async (req, res) => {
  try {
    const productsList = await Product.find({ availability: "Available" });

    const productsListCount = await Product.find({
      isAdmin: { $in: 1 },
      availability: { $in: "Available" },
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

//3. to filter the products by all the *attributes* mentioned above. -both

router.get("/filterProducts", async (req, res) => {
  try {
    const productsList = await Product.find();

    const filters = req.query;
    const filteredProducts = productsList.filter((attributes) => {
      let isValid = true;
      for (let key in filters) {
        console.log(key, attributes[key], filters[key]);
        isValid = isValid && attributes[key] == filters[key];
      }
      return isValid;
    });
    res.send({
      status: 200,
      msg: "Filter products displayed successfully!",
      result: filteredProducts,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

//4.to see how much quality is sold , total amount , how much quantity is left in stock -buyer

router.get("/stockList", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    const leftStockCnt = await Product.find({
      availability: "Available",
    }).count();

    const soldStockQuantity = await Product.find({
      availability: "Out of service",
    });
    const soldStockCnt = await Product.find({
      availability: "Out of service",
    }).count();

    let obj = soldStockQuantity.map(({ price, discount }) => {
      let total_amt = price - discount;
      return total_amt;
    });
    let total_amount = 0;

    obj.forEach((num) => {
      total_amount += num;
    });
    console.log(total_amount);

    if (!productCount) {
      return res.status(500).send({
        status: 500,
        msg: "Something went wrong!",
      });
    }
    res.status(200).send({
      msg: "Fetched successfully!",
      leftStockCnt: leftStockCnt,
      soldStockCnt: soldStockCnt,
      total: total_amount,
    });
  } catch (err) {
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 * /products/uploadFile:
 * post:
 *    summary: Uploads a file.
 *    operationId: bulkUpload
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: formData
 *        name: uploadFile
 *        type: file
 *        description: The file to upload.   
 *    responses:
 *        200:
 *          description: "File Uploaded"
 *        500:
 *          description: Some server error
 */


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/excelUploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

//2. to upload products in bulk using excel -seller

router.post("/uploadFile", upload.single("uploadfile"), function (req, res, next) {
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
module.exports = router;
