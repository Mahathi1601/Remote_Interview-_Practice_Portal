const mongoose = require('mongoose');
require('dotenv').config();

async function hardFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const col = mongoose.connection.db.collection('practicequestions');
        
        // Find all documents
        const allDocs = await col.find().toArray();
        console.log(`Directly processing ${allDocs.length} documents...`);
        
        for (let doc of allDocs) {
            let update = {};
            
            // Map questionText -> question
            if (!doc.question && doc.questionText) update.question = doc.questionText;
            
            // Map categoryId -> type
            if (!doc.type && doc.categoryId) update.type = doc.categoryId;
            
            // Map idealAnswer -> sampleAnswer
            if (!doc.sampleAnswer && doc.idealAnswer) update.sampleAnswer = doc.idealAnswer;
            
            // Normalize difficulty
            if (doc.difficulty === 'Easy') update.difficulty = 'beginner';
            if (doc.difficulty === 'Medium') update.difficulty = 'intermediate';
            if (doc.difficulty === 'Hard') update.difficulty = 'advanced';
            
            // FORCE isActive to boolean true
            update.isActive = true;
            
            await col.updateOne({ _id: doc._id }, { $set: update });
            console.log(`Fixed doc: ${doc._id}`);
        }
        
        console.log('✅ ALL DOCUMENTS FIXED DIRECTLY IN DB.');
        
        // Final count check
        const finalCount = await col.countDocuments({ isActive: true });
        console.log(`Final count of isActive:true documents: ${finalCount}`);
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Hard fix failed:', error);
    }
}

hardFix();
