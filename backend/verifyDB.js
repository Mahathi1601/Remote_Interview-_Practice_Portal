const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const count = await PracticeQuestion.countDocuments();
        console.log(`Total questions in DB: ${count}`);
        
        const questions = await PracticeQuestion.find();
        if (questions.length > 0) {
            console.log('Sample question:', JSON.stringify(questions[0], null, 2));
        } else {
            console.log('No questions found in collection.');
        }
        
        const inactiveQuestions = await PracticeQuestion.find({ isActive: { $ne: true } });
        console.log(`Inactive questions found: ${inactiveQuestions.length}`);
        if (inactiveQuestions.length > 0) {
            console.log('Sample inactive question:', JSON.stringify(inactiveQuestions[0], null, 2));
        }

        const User = require('./models/User');
        const userCount = await User.countDocuments();
        console.log(`Total users in DB: ${userCount}`);
        
        if (userCount > 0) {
            const users = await User.find().limit(5);
            console.log('Sample users (emails only):', users.map(u => u.email));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDB();
