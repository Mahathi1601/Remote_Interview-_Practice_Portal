const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const users = await User.find({}, 'name email createdAt');
        console.log('\n--- Registered Users ---');
        users.forEach((u, i) => {
            console.log(`[${i + 1}] Name: ${u.name}, Email: ${u.email}, Created: ${u.createdAt}`);
        });
        console.log('------------------------\n');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
