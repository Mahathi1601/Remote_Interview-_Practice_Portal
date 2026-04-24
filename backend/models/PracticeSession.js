const mongoose = require('mongoose');

const PracticeSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    feedback: String,
    difficulty: String,
    categoryName: String, // String copy for easier aggregation
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    timeSpent: {
        type: Number,
        default: 0 // in seconds
    },
    confidenceLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PracticeSession', PracticeSessionSchema);
