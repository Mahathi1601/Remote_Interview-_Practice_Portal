const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const getCats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const cats = await mongoose.connection.db.collection('categories').find().toArray();
        console.log('Categories in DB:', cats.map(c => c.name));
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}
getCats();
