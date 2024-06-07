const mongoose = require('mongoose');

const courseProgress = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ],
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

const CourseProgress = mongoose.model('CourseProgress', courseProgress);

module.exports = CourseProgress;
