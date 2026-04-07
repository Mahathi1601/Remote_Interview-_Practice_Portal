const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['technical', 'behavioral', 'hr', 'system-design'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    questions: [{
        question: String,
        userAnswer: String,
        feedback: String,
        score: Number,
        timeSpent: Number
    }],
    overallScore: {
        type: Number,
        min: 0,
        max: 100
    },
    duration: Number,
    completedAt: Date,
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);