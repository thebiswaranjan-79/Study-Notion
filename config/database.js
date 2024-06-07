const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database', error);
        process.exit(1); // Exit process with failure
    });
};
