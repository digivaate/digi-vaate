const express = require('express');
const ImageController = require('../controllers/ImageController');

module.exports = function (dbConnection) {
    const router = express.Router();
    const imageController = new ImageController(dbConnection);

    router.get('/', imageController.getImage);

    return router;
};
