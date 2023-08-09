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
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
    },
    

})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
module.exports= mongoose.model('Product', productSchema);
