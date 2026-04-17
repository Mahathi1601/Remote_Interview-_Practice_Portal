const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

async function countByType() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const counts = await PracticeQuestion.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);
        
        console.log('Question distribution by TYPE:');
        counts.forEach(c => {
            console.log(`- ${c._id || 'MISSING'}: ${c.count}`);
        });
        
        const difficultyCounts = await PracticeQuestion.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
        ]);
        
        console.log('\nQuestion distribution by DIFFICULTY:');
        difficultyCounts.forEach(c => {
            console.log(`- ${c._id || 'MISSING'}: ${c.count}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

countByType();
