const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img: String,  // Image URL
    title: String,  // Image title
    des: String,  // Image description
    buttons: [
        {
            text: String,
            icon: String
        }
    ]
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
