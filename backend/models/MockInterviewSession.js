const mongoose = require('mongoose');

const MockInterviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    interviewType: {
        type: String,
        required: true
    },
    confidenceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    videoUrl: {
        type: String,
        default: null
    },
    hasVideo: {
        type: Boolean,
        default: false
    },
    videoDuration: {
        type: Number,
        default: 0 // in seconds
    },
    feedback: String,
    questionsAsked: {
        type: Number,
        default: 0
    },
    questionsCorrect: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0 // in seconds
    },
    strengths: [String],
    improvementAreas: [String],
    communicationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    technicalScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MockInterviewSession', MockInterviewSessionSchema);
