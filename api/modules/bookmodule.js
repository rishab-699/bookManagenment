// Use require instead of import
const mongoose = require('mongoose');

// Define the Books schema
const booksSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    rent_per_day: {
        type: Number,
        required: true,
        min: 0
    }
});

// Use module.exports to export the model
module.exports = mongoose.models.books || mongoose.model('books', booksSchema);
