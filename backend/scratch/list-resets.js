const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const PasswordReset = require('../models/PasswordReset');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const resets = await PasswordReset.find({});
        console.log('\n--- Active Password Reset Codes ---');
        resets.forEach((r, i) => {
            console.log(`[${i + 1}] Email: ${r.email}, Code: ${r.code}, Expires: ${r.expiresAt}`);
        });
        console.log('-----------------------------------\n');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
