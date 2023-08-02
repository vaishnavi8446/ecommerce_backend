const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const xlsx = require('xlsx');

const fs = require('fs');

const Product = require("../models/product");
const excelReader = require('../helpers/excel-reader');
const filePath = 'C:/Users/Dell/Desktop/ecommerce_backend/file/test.xlsx';


router.get('/getAllProducts', async (req, res) => {
 
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
        fs.writeFileSync('data.json', JSON.stringify(data));
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

module.exports = router;
