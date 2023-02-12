const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true,"userId should be present"]
    },  
    rating: {
        type: Number,
        required: true,
        min:0,
        max:5,
        required:[true,"Rating should be present"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    review: {
        type: String,
        required: true,
        required:[true,"Review should be present"]
    }
     
})

module.exports = mongoose.model('Review', reviewSchema);