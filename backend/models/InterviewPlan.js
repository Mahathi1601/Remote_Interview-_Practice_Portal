const mongoose = require('mongoose');

const interviewPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Please add a role/position'],
        trim: true
    },
    dateTime: {
        type: Date,
        required: [true, 'Please add interview date and time']
    },
    interviewLink: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'missed'],
        default: 'upcoming'
    },
    attended: {
        type: Boolean,
        default: false
    },
    difficultyRating: {
        type: Number,
        min: 1,
        max: 5
    },
    topicsAsked: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewPlan', interviewPlanSchema);
