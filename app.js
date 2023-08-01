const express = require('express');
const app = express();
const mongoose = require('mongoose');


app.use(express.json());

const userRoutes = require('./routes/user');

app.use('/users', userRoutes);

mongoose.connect("mongodb://localhost:27017/ecommerce",{
        useNewUrlParser:true
    },(err)=>{
        if(!err){
            console.log("Connected");
        }
        else{
            console.log("Error");
        }
    })
    


app.listen(3000,()=>{
    console.log("Port running on 3000");
})