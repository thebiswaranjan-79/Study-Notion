const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    timeDuration: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

const SubSection = mongoose.model('SubSection', subSectionSchema);

module.exports = SubSection;
