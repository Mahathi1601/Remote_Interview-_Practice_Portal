const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

async function debugQuestion() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Find the specific question by its known ID from earlier logs
        const q = await PracticeQuestion.findById("69e12d99fb386988f7318335").lean();
        
        if (q) {
            console.log("Question Metadata:");
            console.log("- ID:", q._id);
            console.log("- isActive value:", q.isActive);
            console.log("- isActive type:", typeof q.isActive);
            console.log("- question exists:", !!q.question);
            console.log("- type exists:", !!q.type);
            
            if (q.isActive !== true) {
                console.log("FIXING: Setting isActive to boolean true...");
                await PracticeQuestion.updateOne({ _id: q._id }, { $set: { isActive: true } });
                console.log("Fixed!");
            }
        } else {
            console.log("Question not found!");
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

debugQuestion();
