const express = require('express');
const ImageController = require('../controllers/imageController');
const router = express.Router();

router.get('/', ImageController.getImage);

module.exports = router;
