const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: '0'
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        default: 0
    },
    discount: {
        type: Number,
        default: 0,
    },
    availability:{
        type:String,
        default: "Available"
    }
})

module.exports= mongoose.model('Product', productSchema);