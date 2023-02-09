const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address',
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true,"userId should be present"]
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    },
    paymentDetails:{
        type:Boolean,
        default:false
    }
   
})



module.exports = mongoose.model('Order', orderSchema);