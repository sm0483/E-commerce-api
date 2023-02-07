const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    address: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

})

module.exports = mongoose.model('Address', addressSchema);









