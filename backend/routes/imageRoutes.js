const express = require('express');
const router = express.Router();
const Image = require('../module/Image'); // Use the correct folder name


// Get all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new image
router.post('/', async (req, res) => {
    const { img, title, des, buttons } = req.body;

    const newImage = new Image({ img, title, des, buttons });

    try {
        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
