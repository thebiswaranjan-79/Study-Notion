const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        required: true,
        trim: true,
    },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
