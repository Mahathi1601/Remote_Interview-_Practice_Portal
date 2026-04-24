const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create slug from name
CategorySchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-');
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
