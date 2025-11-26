const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    cardName: {
        type: String,
        required: true
    },
    cardholderName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    cardType: {
        type: String,
        default: 'Visa'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CreditCard', creditCardSchema);
