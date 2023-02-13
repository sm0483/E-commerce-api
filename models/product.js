const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: '0'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    stockCount: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating:{
        type:Number,
        default:0
    },
    reviewCount:{
        type:Number,
        default:0
    }
},{timestamps: true })



module.exports= mongoose.model('Product', productSchema);