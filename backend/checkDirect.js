const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const col = mongoose.connection.db.collection('practicequestions');
        const count = await col.countDocuments();
        console.log(`Direct count in 'practicequestions' collection: ${count}`);
        
        const samples = await col.find().limit(25).toArray();
        samples.forEach((s, i) => {
            console.log(`[${i}] ID: ${s._id}, Question: ${s.question || s.questionText || 'MISSING'}`);
        });
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkData();
