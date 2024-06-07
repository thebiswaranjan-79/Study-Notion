const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
