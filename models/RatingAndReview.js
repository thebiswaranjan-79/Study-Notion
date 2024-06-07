const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        trim: true,
    },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

const RatingAndReview = mongoose.model('RatingAndReview', ratingAndReviewSchema);

module.exports = RatingAndReview;
