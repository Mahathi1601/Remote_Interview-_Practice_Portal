const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

async function migrateData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Find all questions
        const questions = await PracticeQuestion.find();
        console.log(`Checking ${questions.length} questions...`);
        
        let updatedCount = 0;
        
        for (let q of questions) {
            let needsUpdate = false;
            let updateData = {};
            
            // Check for alternative fields
            const raw = q.toObject();
            
            if (!raw.question && raw.questionText) {
                updateData.question = raw.questionText;
                needsUpdate = true;
            }
            
            if (!raw.type && raw.categoryId) {
                updateData.type = raw.categoryId;
                needsUpdate = true;
            }
            
            if (!raw.sampleAnswer && raw.idealAnswer) {
                updateData.sampleAnswer = raw.idealAnswer;
                needsUpdate = true;
            }
            
            // Normalize difficulty
            if (raw.difficulty === 'Easy') {
                updateData.difficulty = 'beginner';
                needsUpdate = true;
            } else if (raw.difficulty === 'Medium') {
                updateData.difficulty = 'intermediate';
                needsUpdate = true;
            } else if (raw.difficulty === 'Hard') {
                updateData.difficulty = 'advanced';
                needsUpdate = true;
            }
            
            // Ensure isActive is true
            if (raw.isActive !== true) {
                updateData.isActive = true;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await PracticeQuestion.findByIdAndUpdate(q._id, updateData);
                updatedCount++;
                console.log(`Updated question: ${q._id}`);
            }
        }
        
        console.log(`✅ Data migration complete. Updated ${updatedCount} questions.`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateData();
