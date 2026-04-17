const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

async function testQuery() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const limit = 50;
        const filter = { isActive: true };
        
        const questions = await PracticeQuestion.find(filter)
            .limit(parseInt(limit))
            .select('question type difficulty tags');
            
        console.log('Results from PracticeQuestion.find({ isActive: true }).limit(50):');
        console.log('Count:', questions.length);
        
        const types = questions.reduce((acc, q) => {
            acc[q.type] = (acc[q.type] || 0) + 1;
            return acc;
        }, {});
        
        console.log('Types mapping:', types);
        
        if (questions.length < 23) {
            console.log('WARNING: Some questions are missing from the search even though they exist in the collection!');
            const allInCollection = await mongoose.connection.db.collection('practicequestions').find().toArray();
            console.log('Total in raw collection:', allInCollection.length);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

testQuery();
