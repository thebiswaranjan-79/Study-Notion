const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

const Category = mongoose.model('Tag', categorySchema);

module.exports = Category;
