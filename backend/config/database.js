const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('IP address')) {
            console.log('\nIMPORTANT: Your current IP address might not be whitelisted in MongoDB Atlas.');
            console.log('Please go to: https://www.mongodb.com/docs/atlas/security-whitelist/\n');
        }
        process.exit(1);
    }
};

module.exports = connectDB;