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
    rating: {
        type: String,
        default: 0,
        min: 0,
        max: 5
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
},{timestamps: true })


productSchema.set('toJSON', {
  virtuals:true,
});



module.exports= mongoose.model('Product', productSchema);