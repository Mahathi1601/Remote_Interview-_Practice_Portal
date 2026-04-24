const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Please add question text'],
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    difficulty: {
        type: String,
        required: [true, 'Please add difficulty level'],
        enum: ['Easy', 'Medium', 'Hard']
    },
    timeLimit: {
        type: Number,
        required: true, // in seconds
        default: 90
    },
    idealAnswer: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        default: []
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

module.exports = mongoose.model('Question', QuestionSchema);
