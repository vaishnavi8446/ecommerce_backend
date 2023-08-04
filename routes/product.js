const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const xlsx = require("xlsx");

const fs = require("fs");

const Product = require("../models/product");
const multer = require("multer");
//let upload = "C:/Users/Dell/Desktop/ecommerce_backend/public/excelUploads/index.html"

const filePath = "C:/Users/Dell/Desktop/ecommerce_backend/file/test.xlsx";

// 2.upload excel file to db

// var storage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//   cb(null,'./public/excelUploads');
//   },
//   filename:(req,file,cb)=>{
//   cb(null,file.originalname);
//   }
//   });
// const upload = multer({dest: 'public/excelUploads'});
// let type = upload.single('file');

// router.post('/uploadFile',type, (req,res)=>{

//      // console.log(req.file);

//       const title = req.body.title;
//       const description = req.body.description;
//       const price = req.body.price;
//       const subCategory = req.body.subCategory;
//       const category = req.body.category;
//       const discount = req.body.discount;

//       let newProduct = new Product({
//           title,
//           description,
//           price,
//           subCategory,
//           category,
//           discount,
//           quantity

//       })
//       res.send({
//         status: 200,
//         msg: "Products added successfully!",
//         result: newProduct,
//       });

// });

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

router.put("/updateProductStatus/:id", async (req, res) => {
  try {
    //  let isAdminStatus = Product.find({isAdmin:1});
      const isAdminStatus = (req, res) => {
        Product.find({isAdmin:1},(err, data) => {
          if (err) {
            res.send(err);
          }
          res.json(data);
        });
        console.log(res);
      };
      
    console.log("isAdminStatus",isAdminStatus);

      if(isAdminStatus ==1 ){  
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
      }
  } catch (err) {
    console.error(err);
    res.send({
      status: 500,
      msg: "Internal Server Error!",
    });
  }
});

module.exports = router;
