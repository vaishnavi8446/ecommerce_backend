const multer = require('multer');


let excelStorage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
         cb(null,'./file');      
    },  
    filename:(req,file,cb)=>{  
         cb(null,file.originalname);  
    }  
});  

let excelUploads = multer({storage:excelStorage}); 

module.exports = excelUploads;