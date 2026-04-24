const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Automatically delete after 10 minutes
    }
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
