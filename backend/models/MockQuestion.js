const mongoose = require('mongoose');

const MockQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Please add question text'],
        trim: true
    },
    interviewType: {
        type: String,
        required: [true, 'Please add interview type'],
        enum: ['technical', 'hr', 'behavioral', 'system-design'],
        lowercase: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    timeLimit: {
        type: Number,
        default: 120 // in seconds
    },
    tips: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MockQuestion', MockQuestionSchema);
