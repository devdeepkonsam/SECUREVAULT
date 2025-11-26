const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    passwordName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    passwordHistory: {
        type: [],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

passwordSchema.set('timestamps', true)

module.exports = mongoose.model('password', passwordSchema);
