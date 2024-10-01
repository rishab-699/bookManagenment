// Use require instead of import
const mongoose = require('mongoose');

// Define the Books schema
const booksTransactionSchema = new mongoose.Schema({
    book_id: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    issuedate: {
        type: Date,
        required: true,
    },
    returndate:{
        type: Date,
    },
    totalRent:{
        type: Number
    }
});

// Use module.exports to export the model
module.exports = mongoose.models.booksTransaction || mongoose.model('booksTransaction', booksTransactionSchema);
